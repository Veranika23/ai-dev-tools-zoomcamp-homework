import requests

def download_markdown(url: str) -> str:
    """
    Downloads the markdown content of a web page using Jina reader (r.jina.ai).

    Args:
        url (str): The URL of the web page to download.

    Returns:
        str: The markdown content of the page.
    """
    # Prepend r.jina.ai to the URL
    jina_url = f"https://r.jina.ai/{url}"
    response = requests.get(jina_url)
    response.raise_for_status()
    return response.text

# Example usage:
if __name__ == "__main__":
    page_url = "https://datatalks.club"
    markdown_content = download_markdown(page_url)
    print(markdown_content)