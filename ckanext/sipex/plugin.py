import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit

def get_recent_datasets(limit=3):
    """Return a list of the n most recently added datasets."""
    try:
        datasets = toolkit.get_action('package_search')({}, {
            'rows': limit,
            'sort': 'metadata_created desc'
        })
        return datasets['results']
    except toolkit.ObjectNotFound:
        return []
    except Exception:
        return []

class SipexPlugin(plugins.SingletonPlugin):
    """SIPEX plugin."""

    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.ITemplateHelpers)  # Add this line

    # Your existing methods stay here
    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('fanstatic', 'sipex')

    def get_helpers(self):
        """Register helpers."""
        return {
            'get_recent_datasets': get_recent_datasets
        }