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
from backend.services.auth_service import register_user, login_user
from backend.models import (
    create_document, save_topics, get_topics_by_doc, save_flashcards,
    get_flashcards_by_doc, update_flashcard_status, save_questions,
    get_questions_by_doc, save_quiz_attempt, get_topic_performance, get_all_documents
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
    print("STARTING DYNAMIC COUNT & DIFFICULTY TEST")
    print("==================================================")
    
    from backend.config import DATABASE_PATH
    if os.path.exists(DATABASE_PATH):
        try:
            os.remove(DATABASE_PATH)
        except Exception:
            pass
    init_db()
    
    user_a = register_user("Alice Student", "alice@university.edu", "password123")
    user_a_id = user_a["user"]["id"]
    
    pdf_filename = create_multi_page_pdf("test_22_page_notes.pdf", 22)
    extracted_text, page_count = extract_text_from_file(pdf_filename)
    chunks = chunk_text(extracted_text, max_chunk_size=3500)
    topics, flashcards, questions = process_text_chunks(chunks)
    
    doc_id = create_document("test_22_page_notes.pdf", "Operating_Systems_Notes.pdf", page_count, len(extracted_text), user_id=user_a_id)
    save_topics(doc_id, topics, user_id=user_a_id)
    # Populate database with 205 flashcards to simulate exact user scenario
    bulk_flashcards = []
    for i in range(1, 206):
        bulk_flashcards.append({
            'question': f'Flashcard Question {i} on OS Concepts?',
            'answer': f'Flashcard Answer {i} detailing kernel architecture.',
            'topic_name': f'Topic {(i % 10) + 1}',
            'difficulty': 'Easy' if i % 3 == 0 else ('Hard' if i % 3 == 1 else 'Medium')
        })
    save_flashcards(doc_id, bulk_flashcards, user_id=user_a_id)

    total_in_db = len(get_flashcards_by_doc(doc_id, user_id=user_a_id, limit=None))
    print(f"Total flashcards in DB: {total_in_db}")
    assert total_in_db >= 205, f"Expected at least 205 flashcards, got {total_in_db}"

    # TEST 1: Select 5
    fc_5 = get_flashcards_by_doc(doc_id, user_id=user_a_id, limit=5)
    assert len(fc_5) == 5, f"Test 1 Failed: Expected 5, got {len(fc_5)}"
    print(f"✓ Test 1 Passed: Select 5 -> {len(fc_5)} flashcards displayed.")

    # TEST 2: Select 10
    fc_10 = get_flashcards_by_doc(doc_id, user_id=user_a_id, limit=10)
    assert len(fc_10) == 10, f"Test 2 Failed: Expected 10, got {len(fc_10)}"
    print(f"✓ Test 2 Passed: Select 10 -> {len(fc_10)} flashcards displayed.")

    # TEST 3: Select 20
    fc_20 = get_flashcards_by_doc(doc_id, user_id=user_a_id, limit=20)
    assert len(fc_20) == 20, f"Test 3 Failed: Expected 20, got {len(fc_20)}"
    print(f"✓ Test 3 Passed: Select 20 -> {len(fc_20)} flashcards displayed.")

    # TEST 4: Select 100
    fc_100 = get_flashcards_by_doc(doc_id, user_id=user_a_id, limit=100)
    assert len(fc_100) == 100, f"Test 4 Failed: Expected 100, got {len(fc_100)}"
    print(f"✓ Test 4 Passed: Select 100 -> {len(fc_100)} flashcards displayed.")

    # TEST 5: Select 205
    fc_205 = get_flashcards_by_doc(doc_id, user_id=user_a_id, limit=205)
    assert len(fc_205) == 205, f"Test 5 Failed: Expected 205, got {len(fc_205)}"
    print(f"✓ Test 5 Passed: Select 205 -> {len(fc_205)} flashcards displayed.")

    # TEST 6: Select 250 (when 205 exist)
    fc_250 = get_flashcards_by_doc(doc_id, user_id=user_a_id, limit=250)
    assert len(fc_250) == total_in_db, f"Test 6 Failed: Expected {total_in_db}, got {len(fc_250)}"
    print(f"✓ Test 6 Passed: Select 250 -> returned all available {len(fc_250)} cards without error.")

    # TEST 7: Delete all flashcards & verify empty state
    from backend.database import get_db
    conn = get_db()
    conn.cursor().execute("DELETE FROM flashcards WHERE user_id = ?", (user_a_id,))
    conn.commit()
    conn.close()
    
    fc_empty = get_flashcards_by_doc(doc_id, user_id=user_a_id, limit=10)
    assert len(fc_empty) == 0, f"Test 7 Failed: Expected 0, got {len(fc_empty)}"
    print(f"✓ Test 7 Passed: Delete all -> {len(fc_empty)} cards returned (triggers empty state).")

    print("\n==================================================")
    print("ALL 7 FLASHCARD DATA FLOW TESTS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == '__main__':
    run_pipeline_test()
