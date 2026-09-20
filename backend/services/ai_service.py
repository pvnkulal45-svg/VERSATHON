import os
import json
import re
import random
from dotenv import load_dotenv

load_dotenv()

# Attempt importing google.genai if available
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if GENAI_AVAILABLE and api_key and api_key.strip() and api_key != "your_gemini_api_key_here":
        try:
            return genai.Client(api_key=api_key)
        except Exception:
            return None
    return None

def heuristic_extract_topics_and_content(text: str):
    """
    NLP Heuristic Extractor: Works offline with 0 API dependencies.
    Extracts rich topics, flashcards, and MCQs directly from document text.
    """
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 20]
    if not paragraphs and lines:
        paragraphs = lines
        
    # 1. Topic Identification
    potential_headings = []
    heading_regex = re.compile(r'^(?:Page\s+\d+\s+(?:of\s+\d+)?\s*[-—:]\s*|MODULE\s+SECTION\s+\d+:?\s*|#+|\d+[\.\)]|[A-Z\s]{4,30}:?|Chapter\s+\d+|Section\s+\d+|Unit\s+\d+)\s*(.+)$', re.IGNORECASE)
    
    for line in lines:
        if len(line) < 80:
            match = heading_regex.match(line)
            if match:
                title = match.group(1).strip('#*:— ').title()
                title = re.sub(r'^\d+\s*[-—:]\s*', '', title).strip().title()
                if 3 < len(title) < 50 and title not in potential_headings:
                    potential_headings.append(title)
            elif line.isupper() and 3 < len(line) < 40 and line.title() not in potential_headings:
                potential_headings.append(line.title())
            elif line.endswith(':') and len(line.split()) <= 5:
                title = line[:-1].strip().title()
                if 3 < len(title) < 50 and title not in potential_headings:
                    potential_headings.append(title)
                    
    # Fallback key concept extraction
    if len(potential_headings) < 3:
        concept_regex = re.compile(r'([A-Z][a-zA-Z0-9\s]{2,25})\s+(?:is|are|refers to|consists of|manages|provides|enables)', re.IGNORECASE)
        for p in paragraphs:
            matches = concept_regex.findall(p)
            for m in matches:
                clean_m = m.strip().title()
                if 3 < len(clean_m) < 40 and clean_m not in potential_headings:
                    potential_headings.append(clean_m)
                    
    default_topics = ["Data Transformation", "System Architecture", "Process Scheduling", "Resource Management", "Security Control"]
    for dt in default_topics:
        if len(potential_headings) < 4 and dt not in potential_headings:
            potential_headings.append(dt)
            
    importance_levels = ["High", "High", "Medium", "High", "Medium", "Low"]
    topics_list = []

    for i, th in enumerate(potential_headings[:8]):
        detailed_desc = f"Comprehensive review of {th} within the scope of the study material."
        simple_desc = f"Think of {th} as a fundamental mechanism that keeps system operations running smoothly."
        example_desc = f"For example, applying {th} ensures consistent processing without resource conflicts."
        
        # Find matching paragraph for text snippets
        matching_p = None
        for p in paragraphs:
            if th.lower() in p.lower():
                matching_p = p
                break
                
        if matching_p:
            detailed_desc = matching_p[:300] + ("..." if len(matching_p) > 300 else "")
            simple_desc = f"{th} manages key workflows as described in the notes: {matching_p[:120]}..."
            example_desc = f"A practical illustration of {th} is observed in: {matching_p[:100]}."

        summary_text = f"Core concepts and operational principles of {th} based on notes."
        imp = importance_levels[i % len(importance_levels)]

        key_pts = [
            f"Primary function of {th} in system execution.",
            f"Key parameters and configuration parameters.",
            f"Operational trade-offs and performance impact."
        ]
        
        exam_tip_text = f"Remember the key term '{th}' and its relationship to core system stability during exams."
        memory_tip_text = f"Use the mnemonic '{th[:3].upper()}' to recall the 3 primary rules of this topic."

        topics_list.append({
            "title": th,
            "summary": summary_text,
            "importance": imp,
            "description": detailed_desc,
            "simple_explanation": simple_desc,
            "detailed_explanation": detailed_desc,
            "example": example_desc,
            "key_points": key_pts,
            "exam_tip": exam_tip_text,
            "memory_tip": memory_tip_text
        })

    # 2. Flashcard Generation
    flashcards_list = []
    seen_questions = set()
    
    def_pattern = re.compile(r'([A-Z][a-zA-Z0-9\s-]{2,30})\s+(is|are|refers to|is defined as|enables|manages|handles)\s+([^.\n]{15,200})', re.IGNORECASE)
    
    for p in paragraphs:
        for match in def_pattern.finditer(p):
            subject, verb, explanation = match.groups()
            subject = subject.strip()
            subject = re.sub(r'^(?:An?|The|Page \d+ of \d+ —?|Module Section \d+:?)\s+', '', subject, flags=re.IGNORECASE).strip()
            explanation = explanation.strip()
            
            if len(subject) < 3 or len(subject) > 40:
                continue
                
            q_text = f"What is {subject}?"
            if q_text in seen_questions:
                continue
            seen_questions.add(q_text)
            
            assigned_topic = topics_list[0]["title"] if topics_list else "General"
            for top in topics_list:
                if top["title"].lower() in p.lower() or subject.lower() in top["title"].lower():
                    assigned_topic = top["title"]
                    break
                    
            ans_text = f"{subject} {verb} {explanation}."
            flashcards_list.append({
                "question": q_text,
                "answer": ans_text,
                "topic_name": assigned_topic,
                "difficulty": random.choice(["Easy", "Medium", "Hard"]),
                "status": "new"
            })

    # Fallback sentence parsing if flashcards < 6
    if len(flashcards_list) < 6:
        for i, p in enumerate(paragraphs):
            sentences = [s.strip() for s in p.split('.') if len(s.strip()) > 25]
            for s in sentences:
                words = s.split()
                if len(words) >= 4:
                    key_term = " ".join(words[:3]).strip(":,.-")
                    q_text = f"What does the notes state regarding '{key_term}'?"
                    if q_text not in seen_questions:
                        seen_questions.add(q_text)
                        assigned_topic = topics_list[i % len(topics_list)]["title"] if topics_list else "General"
                        flashcards_list.append({
                            "question": q_text,
                            "answer": s + ".",
                            "topic_name": assigned_topic,
                            "difficulty": random.choice(["Easy", "Medium", "Hard"]),
                            "status": "new"
                        })

    # 3. Quiz Questions (MCQs) Generation
    questions_list = []
    seen_mcqs = set()
    
    all_terms = []
    for fc in flashcards_list:
        words = re.findall(r'\b[A-Za-z]{4,20}\b', fc["answer"])
        all_terms.extend(words)
    all_terms = list(set(all_terms))
    if len(all_terms) < 10:
        all_terms.extend(["Memory allocation", "Data structure", "Execution cycle", "Buffer overflow", "Thread safety", "Resource lock", "Cache hierarchy", "Protocol stack"])

    for i, fc in enumerate(flashcards_list):
        if len(questions_list) >= 15:
            break
            
        q_text = fc["question"]
        if q_text in seen_mcqs:
            continue
        seen_mcqs.add(q_text)
        
        correct_ans = fc["answer"]
        if len(correct_ans) > 90:
            correct_ans = correct_ans[:90] + "..."
            
        distractors = []
        topic_name = fc["topic_name"]
        
        d_templates = [
            f"Manages external device drivers and hardware protocols.",
            f"Allocates static file storage in non-volatile memory.",
            f"Synchronizes background network socket communication.",
            f"Translates high-level code into intermediate bytecode.",
            f"Optimizes disk I/O scheduling operations."
        ]
        
        random.shuffle(d_templates)
        for dt in d_templates:
            if dt != correct_ans and dt not in distractors:
                distractors.append(dt)
            if len(distractors) == 3:
                break
                
        while len(distractors) < 3:
            distractor_text = f"Provides automated control for {random.choice(all_terms).lower()} processing."
            if distractor_text not in distractors:
                distractors.append(distractor_text)
                
        options = [correct_ans] + distractors
        random.shuffle(options)
        
        correct_idx = options.index(correct_ans)
        correct_letter = ['A', 'B', 'C', 'D'][correct_idx]
        
        questions_list.append({
            "question": q_text,
            "option_a": options[0],
            "option_b": options[1],
            "option_c": options[2],
            "option_d": options[3],
            "correct_option": correct_letter,
            "explanation": f"Based on the notes under '{topic_name}': {fc['answer']}",
            "topic_name": topic_name
        })

    # Ultimate Quiz Safeguard: If questions_list is still empty, build from topics
    if len(questions_list) == 0 and topics_list:
        for top in topics_list:
            q_text = f"What is the primary focus of '{top['title']}'?"
            if q_text not in seen_mcqs:
                seen_mcqs.add(q_text)
                correct_ans = top.get('summary', f"Core concepts and definitions related to {top['title']}.")
                distractors = [
                    f"Manages external hardware protocols.",
                    f"Allocates static file storage in non-volatile memory.",
                    f"Synchronizes background network socket communication."
                ]
                options = [correct_ans] + distractors
                random.shuffle(options)
                correct_letter = ['A', 'B', 'C', 'D'][options.index(correct_ans)]
                questions_list.append({
                    "question": q_text,
                    "option_a": options[0],
                    "option_b": options[1],
                    "option_c": options[2],
                    "option_d": options[3],
                    "correct_option": correct_letter,
                    "explanation": f"Based on notes for '{top['title']}': {correct_ans}",
                    "topic_name": top['title']
                })

    return topics_list, flashcards_list, questions_list

def generate_with_gemini(client, text_chunk: str):
    """
    Calls Gemini API with structured output schema including rich topic explanation fields.
    """
    prompt = f"""You are an expert AI tutor. Analyze the following study notes and generate structured active-learning materials with rich explanations.

STUDY NOTES CONTENT:
{text_chunk}

REQUIRED JSON OUTPUT FORMAT:
Return ONLY a valid JSON object matching this schema exactly:
{{
  "topics": [
    {{
      "title": "Clear Topic Title",
      "summary": "1 sentence short summary suitable for a card.",
      "importance": "High",
      "description": "Concise overview.",
      "simple_explanation": "Beginner-friendly explanation using plain language.",
      "detailed_explanation": "Clear and detailed technical explanation strictly based on notes.",
      "example": "Easy practical example illustrating the topic.",
      "key_points": ["Point 1", "Point 2", "Point 3"],
      "exam_tip": "Key points or keywords students must remember for exams.",
      "memory_tip": "Short trick or mnemonic to remember this topic."
    }}
  ],
  "flashcards": [
    {{
      "question": "Clear question about a concept or definition?",
      "answer": "Concise factual answer based strictly on the text.",
      "topic_name": "Matching topic title from above",
      "difficulty": "Medium"
    }}
  ],
  "questions": [
    {{
      "question": "Multiple choice question?",
      "option_a": "Option A text",
      "option_b": "Option B text",
      "option_c": "Option C text",
      "option_d": "Option D text",
      "correct_option": "A",
      "explanation": "Brief explanation why option is correct based on notes.",
      "topic_name": "Matching topic title"
    }}
  ]
}}
Do NOT invent information outside the study notes. Set importance to 'High', 'Medium', or 'Low'. Ensure correct_option is 'A', 'B', 'C', or 'D'.
"""

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
        )
    )
    
    content = response.text.strip()
    if content.startswith("```json"):
        content = content[7:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    data = json.loads(content)
    return data.get("topics", []), data.get("flashcards", []), data.get("questions", [])

def process_text_chunks(chunks: list):
    """
    Processes all text chunks, combines and deduplicates results.
    """
    client = get_gemini_client()
    
    all_topics = []
    all_flashcards = []
    all_questions = []
    
    for chunk in chunks:
        topics, flashcards, questions = [], [], []
        if client:
            try:
                topics, flashcards, questions = generate_with_gemini(client, chunk)
            except Exception as e:
                print(f"Gemini generation failed for chunk, falling back to NLP heuristic: {e}")
                topics, flashcards, questions = heuristic_extract_topics_and_content(chunk)
        else:
            topics, flashcards, questions = heuristic_extract_topics_and_content(chunk)
            
        all_topics.extend(topics)
        all_flashcards.extend(flashcards)
        all_questions.extend(questions)
        
    # Deduplicate Topics by Title
    unique_topics = {}
    for t in all_topics:
        title = t.get("title", "").strip()
        if title and title.lower() not in unique_topics:
            unique_topics[title.lower()] = {
                "title": title,
                "summary": t.get("summary", t.get("description", "")),
                "importance": t.get("importance", "Medium"),
                "description": t.get("description", ""),
                "simple_explanation": t.get("simple_explanation", ""),
                "detailed_explanation": t.get("detailed_explanation", t.get("description", "")),
                "example": t.get("example", ""),
                "key_points": t.get("key_points", []),
                "exam_tip": t.get("exam_tip", ""),
                "memory_tip": t.get("memory_tip", "")
            }
    final_topics = list(unique_topics.values())
    
    # Deduplicate Flashcards by Question
    unique_flashcards = {}
    for fc in all_flashcards:
        q = fc.get("question", "").strip()
        if q and q.lower() not in unique_flashcards:
            unique_flashcards[q.lower()] = {
                "question": q,
                "answer": fc.get("answer", "").strip(),
                "topic_name": fc.get("topic_name", final_topics[0]["title"] if final_topics else "General"),
                "difficulty": fc.get("difficulty", "Medium"),
                "status": fc.get("status", "new")
            }
    final_flashcards = list(unique_flashcards.values())
    
    # Deduplicate Questions by Question text
    unique_questions = {}
    for q in all_questions:
        q_text = q.get("question", "").strip()
        if q_text and q_text.lower() not in unique_questions:
            unique_questions[q_text.lower()] = {
                "question": q_text,
                "option_a": q.get("option_a", "").strip(),
                "option_b": q.get("option_b", "").strip(),
                "option_c": q.get("option_c", "").strip(),
                "option_d": q.get("option_d", "").strip(),
                "correct_option": q.get("correct_option", "A").strip().upper(),
                "explanation": q.get("explanation", "").strip(),
                "topic_name": q.get("topic_name", final_topics[0]["title"] if final_topics else "General")
            }
    final_questions = list(unique_questions.values())
    
    # Fallback if any category is empty
    if not final_topics or not final_flashcards or not final_questions:
        h_top, h_fc, h_q = heuristic_extract_topics_and_content("\n\n".join(chunks))
        if not final_topics:
            final_topics = h_top
        if not final_flashcards:
            final_flashcards = h_fc
        if not final_questions:
            final_questions = h_q
            
    return final_topics, final_flashcards, final_questions
