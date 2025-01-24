#!/usr/bin/env python3

import argparse
import json
import logging
import requests
from bs4 import BeautifulSoup
from hs_restclient import HydroShare

logger = logging.getLogger(__name__)


def parse_args():
    """Parses command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Script to retrieve HydroShare resources by keyword."
    )
    parser.add_argument(
        "--keywords",
        type=str,
        default="nwm_portal_app",
        help="Keywords to search for in HydroShare resources.",
    )
    return parser.parse_args()


def extract_value_by_name(html, name):
    """Extract a metadata value from a HydroShare resource page by the label name."""
    soup = BeautifulSoup(html, "html.parser")
    rows = soup.select("#extraMetaTable tbody tr")

    for row in rows:
        name_cell = row.select_one("td:first-child")
        value_cell = row.select_one("td:nth-child(2)")

        if name_cell and value_cell and name_cell.get_text(strip=True) == name:
            return value_cell.get_text(strip=True)

    return None


def update_resource(resource, hs):
    """
    Given a single HydroShare resource dictionary and a HydroShare client,
    returns a cleaned-up dictionary containing key metadata fields.
    """
    # Default values
    app_icon = ""
    home_page_url = ""
    source_code_url = ""
    help_page_url = ""

    # If it's a Tool Resource, pull from science metadata via the API
    if resource["resource_type"] == "ToolResource":
        science_metadata_json = hs.getScienceMetadata(resource["resource_id"])

        app_icon_data = science_metadata_json.get("app_icon", {})
        if not isinstance(app_icon_data, dict):
            app_icon_data = {}
        app_icon = app_icon_data.get("data_url", "")

        home_page_data = science_metadata_json.get("app_home_page_url", {})
        if not isinstance(home_page_data, dict):
            home_page_data = {}
        home_page_url = home_page_data.get("value", "")

        source_code_data = science_metadata_json.get("source_code_url", {})
        if not isinstance(source_code_data, dict):
            source_code_data = {}
        source_code_url = source_code_data.get("value", "")

        help_page_data = science_metadata_json.get("help_page_url", {})
        if not isinstance(help_page_data, dict):
            help_page_data = {}
        help_page_url = help_page_data.get("value", "")

    # If it's a Composite Resource, scrape the webpage for metadata
    elif resource["resource_type"] == "CompositeResource":
        resource_scraping = requests.get(resource["resource_url"])
        page_content = resource_scraping.content

        # Attempt to find these extra fields in the page
        app_icon = extract_value_by_name(page_content, "app_icon") or ""
        home_page_url = extract_value_by_name(page_content, "home_page_url") or ""
        source_code_url = extract_value_by_name(page_content, "source_code_url") or ""
        help_page_url = extract_value_by_name(page_content, "help_page_url") or ""

    single_resource = {
        "title": resource["resource_title"],
        "abstract": resource["abstract"],
        "source_code_url": source_code_url,
        "home_page_url": home_page_url,
        "help_page_url": help_page_url,
        "app_icon": app_icon,
        "resource_type": resource["resource_type"],
        "resource_url": resource["resource_url"],
    }
    return single_resource


def get_hydroshare_resources(keywords="nwm_portal_app"):
    """
    Retrieves HydroShare resources that match the given keywords and extracts
    key metadata from each resource. Returns a dictionary with a "resources" list.
    """
    hs = HydroShare(prompt_auth=False)
    json_resources = {"resources": []}

    try:
        # Query resources by keyword
        resources_api = hs.resources(subject=keywords)

        # Pull in additional metadata for each resource
        for resource_api in resources_api:
            single_resource = update_resource(resource_api, hs)
            json_resources["resources"].append(single_resource)

        return json_resources

    except Exception as e:
        logger.error(f"Error retrieving resources: {e}")
        # Return what we have, even if partial.
        return json_resources


def main():
    """Main execution point when running the script from the command line."""
    logging.basicConfig(level=logging.INFO)
    args = parse_args()

    # Retrieve the resources
    result = get_hydroshare_resources(keywords=args.keywords)

    # Print the JSON to stdout (you could also write this to a file if desired)
    with open("hydroshare_resources.json", "w") as f:
        json.dump(result, f, indent=2)


if __name__ == "__main__":
    main()
