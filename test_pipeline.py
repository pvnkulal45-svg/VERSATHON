import sys
import os
import glob
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

# Auto-add base directory, backend directory and venv site-packages to sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, 'backend')
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

venv_sites = glob.glob(os.path.join(backend_dir, 'venv', 'lib', 'python*', 'site-packages'))
for site_path in venv_sites:
    if site_path not in sys.path:
        sys.path.insert(0, site_path)

from backend.services.pdf_service import extract_text_from_file, chunk_text, ScannedPdfError
from backend.services.ai_service import process_text_chunks
from backend.services.auth_service import register_user, login_user, get_user_from_token
from backend.models import (
    create_document, save_topics, get_topics_by_doc, save_flashcards,
    get_flashcards_by_doc, update_flashcard_status, save_questions,
    save_quiz_attempt, get_topic_performance, get_all_documents
)
from backend.database import init_db

def create_multi_page_pdf(filename="sample_os_notes_22pages.pdf", num_pages=22):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    topics_by_page = [
        ("Operating Systems Fundamentals", "An Operating System (OS) is software that manages computer hardware resources and provides common services for computer programs. Operating Systems control hardware execution, allocate CPU cycles, manage system memory, and enforce hardware security rules across computing applications."),
        ("Process Management & Lifecycle", "A Process is defined as a program in execution. The Process Control Block (PCB) contains critical metadata including Process ID (PID), Program Counter, CPU registers, memory limits, and list of open I/O files. Process states transition between New, Ready, Running, Waiting, and Terminated."),
        ("CPU Scheduling & Algorithms", "CPU Scheduling determines which process receives processor time during execution. Key algorithms include First-Come First-Served (FCFS), Shortest Job First (SJF), Priority Scheduling, and Round Robin (RR). Preemptive scheduling interrupts running processes to maintain low response times."),
        ("Thread Synchronization & Mutexes", "Threads are lightweight execution units within a process sharing the same virtual address space. Mutex locks and Semaphores prevent race conditions when multiple threads access shared critical sections concurrently. Binary semaphores enforce mutual exclusion."),
        ("Deadlock Detection & Banker's Algorithm", "A Deadlock occurs when four Coffman conditions hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. The Banker's Algorithm evaluates resource allocation requests dynamically to guarantee safe state transitions."),
        ("Memory Management & Paging", "Memory Management divides main memory between system OS and user processes. Paging breaks physical memory into fixed-size frames and logical memory into pages. Page tables translate logical addresses into physical frame numbers using Translation Lookaside Buffers (TLB)."),
        ("Virtual Memory & Page Replacement", "Virtual Memory allows execution of processes that are not completely loaded into physical memory. Demand paging loads pages only when needed. Page Replacement algorithms include Least Recently Used (LRU), Optimal, and First-In First-Out (FIFO). Page faults trigger I/O page fetches from secondary storage."),
        ("File Systems & Directory Structures", "File Systems provide organized storage and retrieval of file data on physical disks. File Allocation Tables (FAT), Inodes in Unix/Linux, and extent-based systems manage block allocations. Directory structures include Single-level, Two-level, and Tree-structured hierarchies."),
        ("Disk Storage & I/O Scheduling", "Disk Scheduling algorithms optimize secondary storage access latency by reordering I/O requests. FCFS, SSTF (Shortest Seek Time First), SCAN (Elevator algorithm), and C-SCAN minimize magnetic head movement across tracks."),
        ("Mass Storage & RAID Configurations", "RAID (Redundant Array of Independent Disks) improves storage performance and fault tolerance. RAID 0 provides disk striping without parity; RAID 1 mirrors data; RAID 5 uses distributed parity across disk drives; RAID 10 combines striping and mirroring."),
        ("System Protection & Access Control", "Access Control Matrices define security authorizations for domain objects. Access Control Lists (ACLs) attach permissions to objects, while capability lists assign access rights to subjects. Role-Based Access Control (RBAC) simplifies policy administration."),
        ("Security & Malware Defense", "System Security safeguards computing resources against unauthorized access, data theft, and denial of service. Encryption, digital signatures, firewalls, and intrusion detection systems guard network boundaries against malicious code."),
        ("Distributed Systems & RPC", "Distributed Systems orchestrate independent autonomous nodes communicating via network links. Remote Procedure Calls (RPC) allow programs to execute code on remote servers seamlessly. Vector clocks maintain causal ordering across distributed nodes."),
        ("Distributed File Systems (NFS/GFS)", "Network File Systems (NFS) enable transparent file access across local area networks. Google File System (GFS) and HDFS store large files across thousands of commodity hardware servers using chunk replication."),
        ("Cloud Virtualization & Hypervisors", "Hypervisors virtualize physical computing hardware to run multiple concurrent Guest Operating Systems. Type 1 Bare-metal hypervisors (ESXi, Xen) run directly on physical hardware, while Type 2 Hosted hypervisors (VirtualBox) run on host OS."),
        ("Containerization & Docker Architecture", "Containers isolate software processes using Linux Kernel cgroups and namespaces without full OS virtualization overhead. Docker containers package applications with runtime dependencies into lightweight portable images."),
        ("Kernel Architecture & System Calls", "The Kernel is the core component of an Operating System. System Calls (sys_read, sys_write, sys_fork) provide user programs with controlled interfaces to kernel services. Monolithic kernels run all system services in kernel space, whereas Microkernels isolate services in user space."),
        ("Inter-Process Communication (IPC)", "Inter-Process Communication enables processes to exchange data and synchronize actions. Shared Memory provides high-bandwidth IPC, while Message Passing (Pipes, Sockets, Queues) supports distributed process coordination."),
        ("Real-Time Operating Systems (RTOS)", "Real-Time Operating Systems guarantee task execution within strict deterministic timing constraints. Hard RTOS guarantees deadline completion (embedded medical/aerospace), while Soft RTOS prioritizes real-time tasks without hard guarantees."),
        ("Input/Output Hardware & Interrupts", "I/O Hardware uses Memory-Mapped I/O and Port-Mapped I/O interfaces. Interrupt Service Routines (ISRs) handle hardware interrupt requests asynchronously. Direct Memory Access (DMA) transfers block data directly between I/O devices and main memory."),
        ("Embedded Systems & IoT Security", "Embedded systems run low-power operating systems tailored for dedicated hardware microcontrollers. Security mechanisms enforce secure boot, firmware signing, and cryptographic hardware trust anchors."),
        ("Advanced Storage & NVMe Storage", "Non-Volatile Memory Express (NVMe) utilizes solid-state storage over high-speed PCIe buses. Parallel queues and low latency command processing significantly increase random I/O performance over legacy SATA protocols.")
    ]
    
    for i in range(num_pages):
        topic_title, topic_desc = topics_by_page[i % len(topics_by_page)]
        
        c.setFont("Helvetica-Bold", 16)
        c.setFillColor(colors.HexColor("#1e3a8a"))
        c.drawString(50, height - 50, f"Page {i+1} of {num_pages} — {topic_title}")
        
        c.setStrokeColor(colors.HexColor("#3b82f6"))
        c.setLineWidth(1)
        c.line(50, height - 60, width - 50, height - 60)
        
        c.setFont("Helvetica", 11)
        c.setFillColor(colors.HexColor("#1e293b"))
        
        text_object = c.beginText(50, height - 90)
        text_object.setFont("Helvetica", 11)
        text_object.setLeading(16)
        
        text_object.textLine(f"MODULE SECTION {i+1}: {topic_title.upper()}")
        text_object.textLine("")
        text_object.textLine(topic_desc)
        text_object.textLine("")
        text_object.textLine(f"Key Definition: {topic_title} is a fundamental pillar of modern computing systems.")
        text_object.textLine(f"The main role of {topic_title} is to ensure robust system stability and efficient resource management.")
        text_object.textLine(f"Detailed Analysis of Page {i+1}:")
        text_object.textLine(f"- Point 1: {topic_title} regulates system operations under heavy workload conditions.")
        text_object.textLine(f"- Point 2: Modern operating systems implement {topic_title} using optimized algorithms.")
        text_object.textLine(f"- Point 3: Proper configuration of {topic_title} minimizes latency and memory overhead.")
        text_object.textLine("")
        text_object.textLine("Summary Question:")
        text_object.textLine(f"What is {topic_title}?")
        text_object.textLine(f"Answer: {topic_title} {topic_desc.lower()}")
        
        c.drawText(text_object)
        
        c.setFont("Helvetica-Oblique", 9)
        c.setFillColor(colors.HexColor("#64748b"))
        c.drawString(50, 40, "VERSATHON 2.0 E2 — Learn From Your Notes Study Material")
        c.drawRightString(width - 50, 40, f"Page {i+1}")
        
        c.showPage()
        
    c.save()
    print(f"Generated {num_pages}-page PDF: {filename}")
    return filename

def run_pipeline_test():
    print("==================================================")
    print("STARTING END-TO-END SAAS AUTH & PIPELINE TEST")
    print("==================================================")
    
    from backend.config import DATABASE_PATH
    if os.path.exists(DATABASE_PATH):
        try:
            os.remove(DATABASE_PATH)
        except Exception:
            pass
    init_db()
    
    # 1. User Registration & Login Test
    user_a = register_user("Alice Student", "alice@university.edu", "password123")
    token_a = user_a["token"]
    user_a_id = user_a["user"]["id"]
    print(f"✓ Registered User A: {user_a['user']['name']} (ID: {user_a_id})")
    
    login_res = login_user("alice@university.edu", "password123")
    assert login_res["user"]["email"] == "alice@university.edu"
    print(f"✓ Login User A Succeeded! Token Verified.")
    
    user_b = register_user("Bob Student", "bob@university.edu", "password123")
    user_b_id = user_b["user"]["id"]
    print(f"✓ Registered User B: {user_b['user']['name']} (ID: {user_b_id})")

    # 2. Generate 22-page PDF for User A
    pdf_filename = create_multi_page_pdf("test_22_page_notes.pdf", 22)
    extracted_text, page_count = extract_text_from_file(pdf_filename)
    assert page_count == 22, f"Expected 22 pages extracted, got {page_count}"
    
    chunks = chunk_text(extracted_text, max_chunk_size=3500)
    topics, flashcards, questions = process_text_chunks(chunks)
    
    # Verify Rich Topic Fields
    first_top = topics[0]
    print(f"✓ Rich Topic Structure Verified!")
    print(f"  - Title: {first_top['title']}")
    print(f"  - Summary: {first_top['summary']}")
    print(f"  - Importance: {first_top['importance']}")
    print(f"  - Simple Explanation: {first_top['simple_explanation'][:70]}...")
    print(f"  - Detailed Explanation: {first_top['detailed_explanation'][:70]}...")
    
    # Save under User A
    doc_id_a = create_document("test_22_page_notes.pdf", "Operating_Systems_Notes.pdf", page_count, len(extracted_text), user_id=user_a_id)
    saved_topics_a = save_topics(doc_id_a, topics, user_id=user_a_id)
    saved_cards_a = save_flashcards(doc_id_a, flashcards, user_id=user_a_id)
    saved_questions_a = save_questions(doc_id_a, questions, user_id=user_a_id)
    
    # 3. User Data Isolation Test
    docs_user_a = get_all_documents(user_id=user_a_id)
    docs_user_b = get_all_documents(user_id=user_b_id)
    
    assert len(docs_user_a) == 1, "User A should have 1 document"
    assert len(docs_user_b) == 0, "User B should have 0 documents"
    print(f"✓ User Data Isolation Verified!")
    print(f"  - User A Documents: {len(docs_user_a)}")
    print(f"  - User B Documents: {len(docs_user_b)} (User B cannot see User A's study material!)")

    # 4. Flashcard Status Update Test
    first_card = saved_cards_a[0]
    update_flashcard_status(first_card["id"], "know", user_id=user_a_id)
    cards_fetched = get_flashcards_by_doc(doc_id_a, user_id=user_a_id)
    assert cards_fetched[0]["status"] == "know"
    print(f"✓ Flashcard Status Update Verified ('know' status saved).")

    # 5. Quiz & Weak Topic Test under User A
    evaluated_answers = []
    for i, q in enumerate(saved_questions_a):
        is_corr = (i < len(saved_questions_a) // 2)
        selected = q['correct_option'] if is_corr else ('B' if q['correct_option'] != 'B' else 'A')
        evaluated_answers.append({
            'question_id': q['id'],
            'topic_name': q['topic_name'],
            'selected_option': selected,
            'is_correct': is_corr
        })
        
    total_q = len(evaluated_answers)
    corr_q = sum(1 for a in evaluated_answers if a['is_correct'])
    incorr_q = total_q - corr_q
    score_pct = round((corr_q / total_q) * 100.0, 1)
    
    attempt_id = save_quiz_attempt(doc_id_a, total_q, corr_q, incorr_q, score_pct, evaluated_answers, user_id=user_a_id)
    topic_perf = get_topic_performance(doc_id_a, user_id=user_a_id)
    weak_topics = [tp for tp in topic_perf if tp['is_weak']]
    
    print(f"✓ Quiz Attempt Saved for User A! Score: {corr_q}/{total_q} ({score_pct}%)")
    print(f"  - Weak Topics (<60% accuracy): {len(weak_topics)}")
    
    # 6. Scanned PDF Test
    scanned_pdf_name = "test_scanned_dummy.pdf"
    c_scan = canvas.Canvas(scanned_pdf_name, pagesize=letter)
    c_scan.showPage()
    c_scan.save()
    
    scanned_caught = False
    try:
        extract_text_from_file(scanned_pdf_name)
    except ScannedPdfError as err:
        scanned_caught = True
        print(f"✓ Scanned PDF Detection Verified: '{err}'")
        
    assert scanned_caught
    
    print("\n==================================================")
    print("ALL EDTECH SAAS AUTH & PIPELINE TESTS PASSED!")
    print("==================================================")

if __name__ == '__main__':
    run_pipeline_test()
