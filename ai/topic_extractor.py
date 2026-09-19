import re


STOPWORDS = {
    "a", "an", "the", "and", "or", "of", "on", "in", "for",
    "to", "from", "with", "by", "is", "are", "was", "were",
    "as", "at", "be", "this", "that", "these", "those"
}


def extract_topics(text: str) -> list[dict]:
    """
    Extract likely topic headings from PDF text.

    Returns topics with a name and description.
    """

    if not text or not text.strip():
        return []

    topics = []
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    for i, line in enumerate(lines):

        # Ignore very long lines because they are usually paragraphs.
        if len(line) > 100:
            continue

        words = line.split()

        # Ignore single-word lines that are common stopwords.
        if len(words) == 1 and words[0].lower() in STOPWORDS:
            continue

        # Ignore punctuation-only lines.
        if not re.search(r"[A-Za-z]", line):
            continue

        # A likely heading is short and does not end with sentence punctuation.
        if (
            2 <= len(words) <= 8
            and not re.search(r"[.!?,;:]$", line)
        ):
            description = ""

            if i + 1 < len(lines):
                next_line = lines[i + 1]

                # Use the next line as description only if it
                # looks like normal explanatory text.
                if len(next_line) <= 150:
                    description = next_line

            topics.append({
                "name": line,
                "description": description
            })

    # Remove duplicate topic names.
    unique_topics = []
    seen = set()

    for topic in topics:
        key = topic["name"].strip().lower()

        if key not in seen:
            seen.add(key)
            unique_topics.append(topic)

    return unique_topics[:10]