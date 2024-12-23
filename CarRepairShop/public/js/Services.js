document.addEventListener('DOMContentLoaded', function () {

    // JavaScript to handle smooth scrolling
    document.querySelectorAll('a[href^="?"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '?' || this.getAttribute('href') === '#servicesCarousel') {
          return; // Skip smooth scrolling if the href is exactly '#'
        }
        e.preventDefault();
        var targetElement = document.querySelector(this.getAttribute('href'));
        var targetOffset = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
        var duration = 1500; // Adjust duration as needed (in milliseconds)
        slowScrollTo(targetOffset, duration);
      });
    });
  
    // Scroll event
    // Function to check if an element is in the viewport
    function isInViewport(element) {
      var rect = element.getBoundingClientRect();
      var threshold = 0.7; // Adjust this value to set the trigger threshold
      return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * threshold &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) * threshold
      );
    }
  
  
    // Function to handle the scroll event
    function handleScroll() {
      var elements = document.querySelectorAll('.fade-in-hidden');
      elements.forEach(function (element) {
        if (isInViewport(element)) {
          element.classList.add('fade-in');
          element.classList.remove('fade-in-hidden');
        }
      });
    }
  
    // Check for the 'sessionEnded' query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const sessionEnded = urlParams.get('sessionEnded');
    const unauthorizedAccess = urlParams.get('unauthorizedAccess')
    if (sessionEnded) {
      document.getElementById('session-message').classList.remove('nodisplay');
    }
    if (unauthorizedAccess) {
      document.getElementById('unauthorizedAccess').classList.remove('nodisplay');
    }
  
    // Add scroll event listener
    document.addEventListener('scroll', handleScroll);
  
  });
  
  
  
  
  