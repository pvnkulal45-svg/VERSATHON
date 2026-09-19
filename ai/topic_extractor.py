import re


def extract_topics(text: str) -> list[dict]:
    """
    Extract likely topics from PDF text.

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

        # A heading is often short and does not end with punctuation.
        if (
            1 <= len(line.split()) <= 8
            and not re.search(r"[.!?,;:]$", line)
        ):
            description = ""

            if i + 1 < len(lines):
                description = lines[i + 1][:150]

            topics.append({
                "name": line,
                "description": description
            })

    return topics[:10]