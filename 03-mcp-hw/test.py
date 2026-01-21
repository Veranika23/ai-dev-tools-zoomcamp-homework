from ai_assistant import download_markdown

def test_download():
    url = "https://datatalks.club"
    try:
        markdown = download_markdown(url)
        num_chars = len(markdown)
        print(f"Number of characters in downloaded markdown: {num_chars}")
        print("\nTest passed: Content length calculated successfully.")
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_download()