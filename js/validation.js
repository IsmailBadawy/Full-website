// Regular Expressions for validation
const validations = {
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    name: /^[\u0600-\u06FFa-zA-Z\s]{3,30}$/
};

// Validation messages
const messages = {
    email: 'يرجى إدخال بريد إلكتروني صحيح',
    password: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم ورمز خاص',
    name: 'الاسم يجب أن يكون بين 3 و 30 حرفاً'
};

// Validate form input
function validateInput(input, type) {
    const value = input.value.trim();
    const isValid = validations[type].test(value);
    
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        if (!isValid) {
            input.classList.add('is-invalid');
            feedback.textContent = messages[type];
        } else {
            input.classList.remove('is-invalid');
        }
    }
    
    return isValid;
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const isNameValid = validateInput(nameInput, 'name');
    const isEmailValid = validateInput(emailInput, 'email');
    const isPasswordValid = validateInput(passwordInput, 'password');
    
    if (isNameValid && isEmailValid && isPasswordValid) {
        // Store user data
        const userData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            isLoggedIn: true
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show success message and redirect
        Swal.fire({
            title: document.documentElement.lang === 'ar' ? 'تم التسجيل بنجاح!' : 'Registration Successful!',
            text: document.documentElement.lang === 'ar' ? 'مرحبا بك في منصة التعلم!' : 'Welcome to the Learning Platform!',
            icon: 'success',
            confirmButtonText: document.documentElement.lang === 'ar' ? 'حسناً' : 'OK'
        }).then(() => {
            // Hide registration form and show courses
            const registerForm = document.getElementById('registerForm');
            const coursesSection = document.getElementById('coursesSection');
            const registerBtn = document.getElementById('registerBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            const userNameSpan = document.querySelector('.user-name');
            const userName = document.getElementById('userName');

            if (registerForm) registerForm.style.display = 'none';
            if (coursesSection) coursesSection.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (userNameSpan) userNameSpan.style.display = 'inline';
            if (userName) userName.textContent = userData.name;

            // Load courses
            if (typeof window.loadCourses === 'function') {
                window.loadCourses();
            }
        });
    }
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Add input validation on blur
    const inputs = {
        fullName: 'name',
        email: 'email',
        password: 'password'
    };
    
    Object.entries(inputs).forEach(([id, type]) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', () => validateInput(input, type));
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    validateInput(input, type);
                }
            });
        }
    });
    
    // Add password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function(e) {
            e.preventDefault();
            // Toggle password visibility
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const eyeIcon = this.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Check if user is already logged in
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.isLoggedIn) {
        const registerForm = document.getElementById('registerForm');
        const coursesSection = document.getElementById('coursesSection');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userNameSpan = document.querySelector('.user-name');
        const course = document.querySelector('.course');
        const userName = document.getElementById('userName');

        if (registerForm) registerForm.style.display = 'none';
        if (coursesSection) coursesSection.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (userNameSpan) userNameSpan.style.display = 'inline';
        if (userName) userName.textContent = userData.name;

        // Load courses
        if (typeof window.loadCourses === 'function') {
            window.loadCourses();
        }
    }
});
