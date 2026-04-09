// Fireworks Canvas Setup
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particles array
let particles = [];

// Window resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 12;
        this.speedY = (Math.random() - 0.5) * 12;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        
        // Random colors for fireworks
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
            '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#52C9B0'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.2; // gravity
        this.life -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Create fireworks explosion
function createFireworks(x, y) {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y));
    }
    
    // Add some burst particles
    for (let i = 0; i < 40; i++) {
        const particle = new Particle(x, y);
        particle.speedX = (Math.random() - 0.5) * 20;
        particle.speedY = (Math.random() - 0.5) * 20;
        particle.size = Math.random() * 5 + 3;
        particles.push(particle);
    }
}

// Animation loop
function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
    
    if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
    }
}

// Trigger fireworks with multiple explosions
function triggerFireworks() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Create multiple explosions at different positions
    createFireworks(centerX, centerY);
    
    setTimeout(() => {
        createFireworks(centerX - 150, centerY - 100);
        createFireworks(centerX + 150, centerY - 100);
    }, 100);
    
    setTimeout(() => {
        createFireworks(centerX - 200, centerY + 50);
        createFireworks(centerX + 200, centerY + 50);
        createFireworks(centerX, centerY + 200);
    }, 200);
    
    // Start animation
    animateFireworks();
    
    // Add celebration effect with button
    celebrateButton();
}

// Celebrate button effect
function celebrateButton() {
    const btn = document.querySelector('.btn-gift');
    btn.style.animation = 'none';
    
    setTimeout(() => {
        btn.style.animation = 'pulse 0.6s ease-in-out';
    }, 10);
    
    // Add some text feedback
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '🎉 Cảm ơn! 🎉';
    btn.style.opacity = '0.8';
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.opacity = '1';
    }, 2000);
}

// Add click effect on profile card
document.querySelector('.profile-card').addEventListener('click', function(e) {
    if (e.target.closest('.btn')) return; // Don't add effect if clicking button
    
    // Create a subtle ripple effect
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'radial-gradient(circle, rgba(102,126,234,0.5), transparent)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'rippleEffect 0.6s ease-out';
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== MESSAGE SYSTEM WITH TELEGRAM =====
// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8342054387:AAH-lOR2A486-YaiS9iTcmJgmxr_6I3370U';
const TELEGRAM_CHAT_ID = '-5124794402';

// Load messages from localStorage
let messages = JSON.parse(localStorage.getItem('profileMessages')) || [];

// Display messages on page load
document.addEventListener('DOMContentLoaded', () => {
    displayMessages();
});

// Send message to Telegram
function sendToTelegram(senderName, messageText) {
    const telegramMessage = `
📨 Tin nhắn từ Trang Web Digital Profile:

👤 Người gửi: ${senderName}
📝 Nội dung: ${messageText}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('✅ Tin nhắn đã gửi đến Telegram!');
        } else {
            console.error('❌ Lỗi gửi Telegram:', data.description);
        }
    })
    .catch(error => {
        console.error('❌ Lỗi kết nối Telegram:', error);
    });
}

// Send message function
function sendMessage() {
    const senderName = document.getElementById('senderName').value.trim();
    const messageText = document.getElementById('messageText').value.trim();
    
    // Validation
    if (!senderName) {
        alert('Vui lòng nhập tên của bạn!');
        return;
    }
    if (!messageText) {
        alert('Vui lòng nhập lời nhắn!');
        return;
    }
    
    // Create message object
    const message = {
        id: Date.now(),
        sender: senderName,
        text: messageText,
        timestamp: new Date().toLocaleString('vi-VN')
    };
    
    // Add message to array
    messages.unshift(message);
    
    // Save to localStorage
    localStorage.setItem('profileMessages', JSON.stringify(messages));
    
    // Send to Telegram
    sendToTelegram(senderName, messageText);
    
    // Clear form
    document.getElementById('senderName').value = '';
    document.getElementById('messageText').value = '';
    
    // Refresh display
    displayMessages();
    
    // Show success message
    showSuccessMessage();
}

// Display all messages
function displayMessages() {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<p style="text-align: center; color: #999; font-size: 14px; padding: 20px;">Chưa có lời nhắn nào. Hãy để lại lời nhắn đầu tiên! 😊</p>';
        return;
    }
    
    messages.forEach(msg => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <div class="message-sender">👤 ${escapeHtml(msg.sender)}</div>
            <div class="message-content">${escapeHtml(msg.text)}</div>
            <div class="message-time">⏰ ${msg.timestamp}</div>
        `;
        messagesList.appendChild(messageItem);
    });
}

// Show success message
function showSuccessMessage() {
    const messageForm = document.querySelector('.message-form');
    const originalBg = messageForm.style.background;
    messageForm.style.background = 'rgba(76, 175, 80, 0.2)';
    messageForm.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';
    
    setTimeout(() => {
        messageForm.style.background = originalBg;
        messageForm.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    }, 1500);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter key to send message (Ctrl+Enter or Shift+Enter)
document.getElementById('messageText').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.shiftKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// Allow Enter in name field to focus message
document.getElementById('senderName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('messageText').focus();
    }
});
