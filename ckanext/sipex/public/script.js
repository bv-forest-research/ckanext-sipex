$(document).ready(function() {
    initializeFacets();
    
    $(document).off('click', '.facet-toggle');
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
    
    if (document.body) {
        document.body.addEventListener('htmx:afterSettle', function(evt) {
            setTimeout(function() {
                initializeFacets();
            }, 100);
        });
    }
});

function initializeFacets() {
    $('.module-heading').each(function() {
        var $heading = $(this);
        var $section = $heading.closest('section');
        
        if ($section.closest('.dataset-view').length === 0 && 
            $section.find('.module-content.description').length > 0) {
            return;
        }
        
        if ($heading.find('.facet-toggle').length > 0) {
            return;
        }
        
        var $filterIcon = $heading.find('.fa-filter');
        var filterIconHtml = $filterIcon.length ? $filterIcon.prop('outerHTML') : '';
        
        var headingText = '';
        $heading.contents().each(function() {
            if (this.nodeType === 3) { 
                var text = $(this).text().trim();
                if (text) {
                    headingText += text;
                }
            }
        });
        
        if (!headingText) {
            $heading.children().each(function() {
                if (!$(this).hasClass('fa') && !$(this).hasClass('pull-right') && !$(this).hasClass('facet-toggle')) {
                    headingText = $(this).text().trim();
                    if (headingText) {
                        return false;
                    }
                }
            });
        }
        
        if (!headingText) {
            return;
        }
        
        var collapseId = 'facet-' + headingText.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        var $collapseContent = $section.find('.module-content').not('.description');
        if ($collapseContent.length === 0) {
            $collapseContent = $section.find('.nav-facet, .module-footer');
        }
        
        if ($collapseContent.length === 0) {
            return;
        }
        
        var $existingContainer = $('#' + collapseId);
        
        if ($existingContainer.length === 0) {
            if ($collapseContent.parent().is('[id^="facet-"]')) {
                $existingContainer = $collapseContent.parent();
                collapseId = $existingContainer.attr('id');
            } else {
                $collapseContent.wrapAll('<div id="' + collapseId + '" class="collapse"></div>');
                $existingContainer = $('#' + collapseId);
            }
        }
        
        var savedState = localStorage.getItem('facet_' + collapseId);
        
        var $toggleBtn = $(
            '<a href="#" class="facet-toggle" data-toggle="collapse" data-target="#' + collapseId + '" aria-expanded="' + (savedState === 'expanded' ? 'true' : 'false') + '" aria-controls="' + collapseId + '">' +
            '<i class="fa ' + (savedState === 'expanded' ? 'fa-chevron-up' : 'fa-chevron-down') + ' facet-toggle-icon"></i>' +
            '</a>'
        );
        
        var $headingText = $heading.find('.facet-heading-text');
        if ($headingText.length === 0) {
            $heading.empty();
            $heading.append(filterIconHtml + ' <span class="facet-heading-text">' + headingText + '</span>');
            $heading.append($toggleBtn);
        } else {
            if ($heading.find('.facet-toggle').length === 0) {
                $heading.append($toggleBtn);
            }
        }
        
        if (savedState === 'expanded') {
            $existingContainer.addClass('show');
        } else {
            $existingContainer.removeClass('show');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.account.authed')) {
        document.body.classList.add('user-is-logged-in');
    }
});

function toggleRefineSearch() {
    const refineSection = document.getElementById('refine-search');
    const chevron = document.getElementById('refine-chevron');
    const toggle = document.getElementById('refine-toggle');
    const hero = document.querySelector('.homepage .hero');
    
    if (refineSection.classList.contains('show')) {
        const currentHeight = refineSection.scrollHeight;
        refineSection.style.maxHeight = currentHeight + 'px';
        refineSection.style.padding = '20px';
        refineSection.offsetHeight;
        
        refineSection.style.maxHeight = '0';
        refineSection.style.padding = '0 20px';
        toggle.classList.remove('refine-expanded');
        
        setTimeout(() => {
            refineSection.classList.remove('show');
            refineSection.style.padding = '';
        }, 400);
        
        if (hero) {
            hero.style.minHeight = '65vh';
        }
    } else {
        refineSection.classList.add('show');
        refineSection.style.padding = '20px';
        const scrollHeight = refineSection.scrollHeight;
        refineSection.style.maxHeight = scrollHeight + 'px';
        toggle.classList.add('refine-expanded');
        
        if (hero) {
            const heroHeight = hero.offsetHeight;
            const newHeight = heroHeight + scrollHeight + 40;
            hero.style.minHeight = newHeight + 'px';
            
            setTimeout(() => {
                refineSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 450);
        }
        
        setTimeout(() => {
            if (refineSection.classList.contains('show')) {
                refineSection.style.maxHeight = 'none';
            }
        }, 400);
    }
}

function clearFilters() {
    const selects = document.querySelectorAll('#refine-search select');
    selects.forEach(select => {
        select.selectedIndex = 0;
    });
    
    const searchInput = document.getElementById('field-main-search');
    if (searchInput) {
        searchInput.value = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const refineSection = document.getElementById('refine-search');
    if (refineSection) {
        refineSection.classList.remove('show');
        refineSection.style.display = '';
    }
});

window.toggleDescription = function(packageId) {
    var container = document.getElementById('desc-' + packageId);
    if (!container) {
        return;
    }
    
    var isExpanded = container.classList.contains('expanded');
    
    if (isExpanded) {
        container.classList.remove('expanded');
    } else {
        container.classList.add('expanded');
    }
};

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

document.addEventListener('DOMContentLoaded', function() {
    const infoBtn = document.getElementById('search-info-btn');
    const tooltip = document.getElementById('search-tooltip');
    
    if (infoBtn && tooltip) {
        infoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = tooltip.classList.contains('show');
            
            if (isVisible) {
                hideTooltip();
            } else {
                showTooltip();
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!infoBtn.contains(e.target) && !tooltip.contains(e.target)) {
                hideTooltip();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideTooltip();
            }
        });
        
        tooltip.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    function showTooltip() {
        tooltip.classList.add('show');
        infoBtn.setAttribute('aria-expanded', 'true');
    }
    
    function hideTooltip() {
        tooltip.classList.remove('show');
        infoBtn.setAttribute('aria-expanded', 'false');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const infoBtn = document.getElementById('search-info-btn');
    
    if (infoBtn) {
        infoBtn.setAttribute('aria-label', 'Show search tips');
        infoBtn.setAttribute('aria-expanded', 'false');
        infoBtn.setAttribute('aria-haspopup', 'true');
    }
});