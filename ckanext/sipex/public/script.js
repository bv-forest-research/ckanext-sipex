$(document).ready(function() {
    // First, handle any existing toggles and clean them up
    $('.facet-toggle').remove();
    $('.facet-toggle-icon').remove();
    
    // Process each module heading
    $('.module-heading').each(function() {
        var $heading = $(this);
        var $section = $heading.closest('section');
        
        // Skip sections that shouldn't have toggles (in org/group views)
        if ($section.closest('.dataset-view').length === 0 && 
            $section.find('.module-content.description').length > 0) {
            return;
        }
        
        // Extract and preserve filter icon
        var $filterIcon = $heading.find('.fa-filter');
        var filterIconHtml = $filterIcon.length ? $filterIcon.prop('outerHTML') : '';
        
        // Get clean heading text
        var headingText = '';
        $heading.contents().each(function() {
            if (this.nodeType === 3) { // Text node
                headingText += $(this).text().trim();
            }
        });
        
        // If no text found, try to get it from a child element
        if (!headingText) {
            $heading.children().each(function() {
                if (!$(this).hasClass('fa') && !$(this).hasClass('pull-right')) {
                    headingText = $(this).text().trim();
                    return false;
                }
            });
        }
        
        // Clear and rebuild heading
        $heading.empty();
        $heading.append(filterIconHtml + ' <span class="facet-heading-text">' + headingText + '</span>');
        
        // Create an ID for the collapse element if it doesn't have one
        var $collapseContent = $section.find('.module-content').not('.description');
        if ($collapseContent.length === 0) {
            $collapseContent = $section.find('.nav-facet, .module-footer');
        }
        
        // Skip if there's no content to collapse
        if ($collapseContent.length === 0) {
            return;
        }
        
        // Find or create collapse container
        var collapseId;
        var $existingContainer = $section.find('[id^="facet-"]');
        
        if ($existingContainer.length) {
            collapseId = $existingContainer.attr('id');
        } else {
            // Generate a stable ID based on heading text to ensure consistency across page loads
            collapseId = 'facet-' + headingText.toLowerCase().replace(/[^a-z0-9]/g, '-');
            
            // Wrap content in collapse container
            $collapseContent.wrapAll('<div id="' + collapseId + '" class="collapse"></div>');
        }
        
        // Get the collapse container reference
        var $collapseContainer = $('#' + collapseId);
        
        // Create toggle button
        var $toggleBtn = $(
            '<a href="#" class="facet-toggle" data-toggle="collapse" data-target="#' + collapseId + '" aria-expanded="false" aria-controls="' + collapseId + '">' +
            '<i class="fa fa-chevron-down facet-toggle-icon"></i>' +
            '</a>'
        );
        
        // Add toggle to heading
        $heading.append($toggleBtn);
        
        // CRITICAL: Check saved state and apply it
        var savedState = localStorage.getItem('facet_' + collapseId);
        
        if (savedState === 'expanded') {
            // Ensure it's expanded
            $collapseContainer.addClass('show');
            $toggleBtn.attr('aria-expanded', 'true');
            $toggleBtn.find('.facet-toggle-icon')
                .removeClass('fa-chevron-down')
                .addClass('fa-chevron-up');
        } else {
            // Ensure it's collapsed
            $collapseContainer.removeClass('show');
        }
    });
    
    // Handle toggle clicks
    $(document).on('click', '.facet-toggle', function(e) {
        e.preventDefault();
        
        var $toggle = $(this);
        var targetId = $toggle.data('target').substring(1); // Remove the # character
        var $target = $('#' + targetId);
        var $icon = $toggle.find('.facet-toggle-icon');
        
        // Toggle the collapse state
        if ($target.hasClass('show')) {
            // Currently expanded, so collapse it
            $target.removeClass('show');
            $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            $toggle.attr('aria-expanded', 'false');
            
            // Save collapsed state
            localStorage.setItem('facet_' + targetId, 'collapsed');
        } else {
            // Currently collapsed, so expand it
            $target.addClass('show');
            $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            $toggle.attr('aria-expanded', 'true');
            
            // Save expanded state
            localStorage.setItem('facet_' + targetId, 'expanded');
        }
    });
    
    // Force state after page is fully loaded
    $(window).on('load', function() {
        // This runs after everything else has loaded
        setTimeout(function() {
            $('.module-heading').each(function() {
                var $heading = $(this);
                var $toggle = $heading.find('.facet-toggle');
                
                if ($toggle.length === 0) return;
                
                var targetId = $toggle.data('target').substring(1);
                var savedState = localStorage.getItem('facet_' + targetId);
                
                if (savedState === 'expanded') {
                    // Force show
                    $('#' + targetId).addClass('show');
                    $toggle.find('.facet-toggle-icon')
                        .removeClass('fa-chevron-down')
                        .addClass('fa-chevron-up');
                    $toggle.attr('aria-expanded', 'true');
                }
            });
        }, 100); // Short delay to ensure everything is initialized
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in by looking for .account.authed element
    if (document.querySelector('.account.authed')) {
      document.body.classList.add('user-is-logged-in');
    }
  });