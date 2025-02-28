(function() {
    // Create and append styles
    const style = document.createElement('style');
    style.textContent = `
      .return-portal-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 9999;
        align-items: center;
        justify-content: center;
      }
      
      .return-portal-iframe {
        width: 90%;
        max-width: 1000px;
        height: 80vh;
        background: white;
        border-radius: 8px;
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .return-portal-button {
        background-color: #3b82f6;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .return-portal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 30px;
        height: 30px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }
    `;
    document.head.appendChild(style);
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'return-portal-modal';
    
    // Create close button
    const closeBtn = document.createElement('div');
    closeBtn.className = 'return-portal-close';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'return-portal-iframe';
    iframe.src = 'https://your-return-portal-url.com'; // Replace with your deployed URL
    
    // Add elements to DOM
    modal.appendChild(closeBtn);
    modal.appendChild(iframe);
    document.body.appendChild(modal);
    
    // Create button that merchants can place anywhere
    const button = document.createElement('button');
    button.className = 'return-portal-button';
    button.innerText = 'Start a Return';
    button.addEventListener('click', function() {
      modal.style.display = 'flex';
    });
    
    // Add button to page
    // You can customize where it appears in the theme
    const buttonContainer = document.querySelector('footer') || document.body;
    buttonContainer.appendChild(button);
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  })();