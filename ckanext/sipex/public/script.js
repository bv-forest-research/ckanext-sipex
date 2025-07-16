$(document).ready(function() {
    // clean up toggles
    $('.facet-toggle').remove();
    $('.facet-toggle-icon').remove();
    
    // find all headings
    $('.module-heading').each(function() {
        var $heading = $(this);
        var $section = $heading.closest('section');
        
        // determine and skip sections that don't need toggles
        if ($section.closest('.dataset-view').length === 0 && 
            $section.find('.module-content.description').length > 0) {
            return;
        }
        
        var $filterIcon = $heading.find('.fa-filter');
        var filterIconHtml = $filterIcon.length ? $filterIcon.prop('outerHTML') : '';
        
        var headingText = '';
        $heading.contents().each(function() {
            if (this.nodeType === 3) { 
                headingText += $(this).text().trim();
            }
        });
        
        // use child if no text found
        if (!headingText) {
            $heading.children().each(function() {
                if (!$(this).hasClass('fa') && !$(this).hasClass('pull-right')) {
                    headingText = $(this).text().trim();
                    return false;
                }
            });
        }
        
        // rebuild
        $heading.empty();
        $heading.append(filterIconHtml + ' <span class="facet-heading-text">' + headingText + '</span>');
        
        var $collapseContent = $section.find('.module-content').not('.description');
        if ($collapseContent.length === 0) {
            $collapseContent = $section.find('.nav-facet, .module-footer');
        }
        
        if ($collapseContent.length === 0) {
            return;
        }
        
        var collapseId;
        var $existingContainer = $section.find('[id^="facet-"]');
        
        if ($existingContainer.length) {
            collapseId = $existingContainer.attr('id');
        } else {
            collapseId = 'facet-' + headingText.toLowerCase().replace(/[^a-z0-9]/g, '-');
            
            $collapseContent.wrapAll('<div id="' + collapseId + '" class="collapse"></div>');
        }
        
        var $collapseContainer = $('#' + collapseId);
        
        var $toggleBtn = $(
            '<a href="#" class="facet-toggle" data-toggle="collapse" data-target="#' + collapseId + '" aria-expanded="false" aria-controls="' + collapseId + '">' +
            '<i class="fa fa-chevron-down facet-toggle-icon"></i>' +
            '</a>'
        );
        
        $heading.append($toggleBtn);
        
        // save filter states when refreshed
        var savedState = localStorage.getItem('facet_' + collapseId);
        
        if (savedState === 'expanded') {
            $collapseContainer.addClass('show');
            $toggleBtn.attr('aria-expanded', 'true');
            $toggleBtn.find('.facet-toggle-icon')
                .removeClass('fa-chevron-down')
                .addClass('fa-chevron-up');
        } else {
            $collapseContainer.removeClass('show');
        }
    });
    
    // toggle clicks
    $(document).on('click', '.facet-toggle', function(e) {
        e.preventDefault();
        
        var $toggle = $(this);
        var targetId = $toggle.data('target').substring(1);
        var $target = $('#' + targetId);
        var $icon = $toggle.find('.facet-toggle-icon');
        
        if ($target.hasClass('show')) {
            $target.removeClass('show');
            $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            $toggle.attr('aria-expanded', 'false');
            
            localStorage.setItem('facet_' + targetId, 'collapsed');
        } else {
            $target.addClass('show');
            $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            $toggle.attr('aria-expanded', 'true');
            
            localStorage.setItem('facet_' + targetId, 'expanded');
        }
    });
    
    $(window).on('load', function() {
        setTimeout(function() {
            $('.module-heading').each(function() {
                var $heading = $(this);
                var $toggle = $heading.find('.facet-toggle');
                
                if ($toggle.length === 0) return;
                
                var targetId = $toggle.data('target').substring(1);
                var savedState = localStorage.getItem('facet_' + targetId);
                
                if (savedState === 'expanded') {
                    $('#' + targetId).addClass('show');
                    $toggle.find('.facet-toggle-icon')
                        .removeClass('fa-chevron-down')
                        .addClass('fa-chevron-up');
                    $toggle.attr('aria-expanded', 'true');
                }
            });
        }, 100); 
    });
});

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.account.authed')) {
      document.body.classList.add('user-is-logged-in');
    }
  });


function toggleRefineSearch() {
  const refineSection = document.getElementById('refine-search');
  const chevron = document.getElementById('refine-chevron');
  const toggle = document.getElementById('refine-toggle');
  
  if (refineSection.style.display === 'none') {
    refineSection.style.display = 'block';
    toggle.classList.add('refine-expanded');
  } else {
    refineSection.style.display = 'none';
    toggle.classList.remove('refine-expanded');
  }
}

function clearFilters() {
  const selects = document.querySelectorAll('#refine-search select');
  selects.forEach(select => {
    select.selectedIndex = 0;
  });
}

window.toggleDescription = function(packageId) {
    console.log('Toggling description for package:', packageId);
    
    var container = document.getElementById('desc-' + packageId);
    if (!container) {
    console.error('Container not found for package:', packageId);
    return;
    }
    
    var isExpanded = container.classList.contains('expanded');
    console.log('Current state expanded:', isExpanded);
    
    if (isExpanded) {
    container.classList.remove('expanded');
    console.log('Collapsed description');
    } else {
    container.classList.add('expanded');
    console.log('Expanded description');
    }
};

console.log('Description toggle function loaded');


function toggleTags(event) {
    event.preventDefault();
    const toggle = event.currentTarget;
    const content = document.getElementById('tags-content');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
    content.style.display = 'none';
    toggle.setAttribute('aria-expanded', 'false');
    } else {
    content.style.display = 'block';
    toggle.setAttribute('aria-expanded', 'true');
    }
}