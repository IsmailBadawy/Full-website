// Counter functions
function startCounter(element, endValue) {
    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms for smoother animation
    const steps = duration / interval;
    const increment = endValue / steps;

    const counter = setInterval(() => {
        currentValue += increment;
        if (currentValue >= endValue) {
            currentValue = endValue;
            clearInterval(counter);
        }
        element.textContent = Math.floor(currentValue) + "+";
    }, interval);
}

function initializeCounters() {
    const statElements = document.querySelectorAll('.stat h3[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const endValue = parseInt(element.getAttribute('data-count'));

                if (!element.hasAttribute('data-counted')) {
                    element.setAttribute('data-counted', 'true');
                    startCounter(element, endValue);
                }
            }
        });
    }, { threshold: 0.5 });

    statElements.forEach(element => observer.observe(element));
}

// Validation functions
function validatePassword(password) {
    // Password must contain:
    // - At least 8 characters
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function showError(message) {
    const currentLang = document.documentElement.lang || 'ar';
    Swal.fire({
        text: currentLang === 'ar' ? message.ar : message.en,
        icon: 'info',
        confirmButtonText: currentLang === 'ar' ? 'حسنًا' : 'OK'
    });

}

// Courses functions
let courses = [];

async function loadCourses() {
    const coursesContainer = document.getElementById('coursesContainer');
    if (!coursesContainer) {
        console.error('لم يتم العثور على عنصر coursesContainer');
        return;
    }

    // عرض مؤشر التحميل
    coursesContainer.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
            </div>
        </div>
    `;

    try {
        const response = await fetch('courses.json');
        if (!response.ok) {
            throw new Error('فشل تحميل الكورسات');
        }
        courses = await response.json();
        displayCourses(courses);
    } catch (error) {
        console.error('خطأ في تحميل الكورسات:', error);
        coursesContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger" role="alert">
                    حدث خطأ أثناء تحميل الكورسات. يرجى المحاولة مرة أخرى.
                </div>
            </div>
        `;
    }
}

function displayCourses(coursesData) {
    const coursesContainer = document.getElementById('coursesContainer');
    if (!coursesContainer) {
        console.error('لم يتم العثور على عنصر coursesContainer');
        return;
    }

    if (!Array.isArray(coursesData) || coursesData.length === 0) {
        coursesContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info" role="alert">
                    لا توجد كورسات متاحة حالياً
                </div>
            </div>
        `;
        return;
    }

    coursesContainer.innerHTML = coursesData.map(course => `
        <div class="col-md-4 mb-4">
            <div class="card course-card h-100 shadow-sm">
                <img src="${course.image}" class="card-img-top" alt="${course.title}" 
                     onerror="this.src='https://placehold.co/600x400/2196f3/ffffff?text=Course'">
                <div class="card-body">
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text text-muted small">${course.description.substring(0, 100)}...</p>
                    <div class="d-flex align-items-center mb-3">
                        <img src="${course.instructor?.image || 'https://placehold.co/100x100/2196f3/ffffff?text=IN'}" 
                             class="rounded-circle me-2" 
                             width="30" 
                             height="30" 
                             alt="${course.instructor?.name || 'Instructor'}">
                        <small class="text-muted">${course.instructor?.name || 'Instructor'}</small>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <small class="text-muted">
                                <i class="fas fa-book-open me-1 text-primary"></i>
                                ${course.lectures || 0} محاضرة
                            </small>
                        </div>
                        <div class="col">
                            <small class="text-muted">
                                <i class="fas fa-clock me-1 text-primary"></i>
                                ${course.hours || 0} ساعة
                            </small>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0 text-primary">
                            ${course.price || 0} جنيه
                        </h6>
                        <button class="btn btn-outline-primary btn-sm" onclick="showCourseDetails(${course.id})">
                            عرض التفاصيل
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showCourseDetails(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'لم يتم العثور على الكورس'
        });
        return;
    }

    // تحديث محتوى المودال
    const modal = document.getElementById('courseModal');
    if (!modal) return;

    const modalElements = {
        'courseDetailImage': course.image,
        'courseDetailTitle': course.title,
        'courseDetailDescription': course.description,
        'instructorImage': course.instructor.image,
        'instructorName': course.instructor.name,
        'courseDetailLectures': course.lectures,
        'courseDetailHours': `${course.hours} ساعة`,
        'courseDetailPrice': `${course.price} جنيه`
    };

    // تحديث كل عنصر في المودال
    Object.entries(modalElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'IMG') {
                element.src = value;
                element.alt = course.title;
            } else {
                element.textContent = value;
            }
        }
    });

    // تخزين الكورس الحالي
    window.currentCourse = course;

    // عرض المودال
    const courseModal = new bootstrap.Modal(modal);
    courseModal.show();
}

function handlePurchase() {
    if (!window.currentCourse) return;

    // التحقق من تسجيل الدخول
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'يجب تسجيل الدخول أولاً',
            confirmButtonText: 'حسناً'
        });
        return;
    }

    // حفظ بيانات الكورس في localStorage للوصول إليها في صفحة الدفع
    localStorage.setItem('selectedCourse', JSON.stringify({
        id: window.currentCourse.id,
        title: window.currentCourse.title,
        price: window.currentCourse.price
    }));

    // إغلاق مودال الكورس
    const courseModal = bootstrap.Modal.getInstance(document.getElementById('courseModal'));
    if (courseModal) courseModal.hide();

    // الانتقال إلى صفحة الدفع
    window.location.href = 'payment.html';
}

// معالجة نموذج الدفع
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'جارٍ معالجة الدفع...',
            html: 'يرجى الانتظار...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setTimeout(() => {
            const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
            if (paymentModal) paymentModal.hide();

            Swal.fire({
                icon: 'success',
                title: 'تم الدفع بنجاح!',
                text: `تم تسجيلك بنجاح في دورة "${window.currentCourse.title}"`,
                confirmButtonText: 'حسناً'
            }).then(() => {
                paymentForm.reset();

                // تحديث بيانات المستخدم
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData && window.currentCourse) {
                    userData.enrolledCourses = userData.enrolledCourses || [];
                    userData.enrolledCourses.push(window.currentCourse.id);
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            });
        }, 2000);
    });
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function () {
    // تهيئة المودال
    const courseModal = document.getElementById('courseModal');
    const paymentModal = document.getElementById('paymentModal');

    if (courseModal) {
        new bootstrap.Modal(courseModal);
    }
    if (paymentModal) {
        new bootstrap.Modal(paymentModal);
    }

    // إضافة مستمع الحدث لزر الشراء
    const purchaseBtn = document.getElementById('purchaseCourseBtn');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', handlePurchase);
    }

    // تحميل الكورسات
    loadCourses();
});

// Authentication functions
function showCoursesSection() {
    const registerForm = document.getElementById('registerForm');
    const mainContent = document.querySelectorAll('.hero-section, .features-section, .contact-section, .courses-section');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameSpan = document.querySelector('.user-name');

    if (registerForm) {
        registerForm.style.display = 'none';
    }

    // Show main content sections
    mainContent.forEach(section => {
        if (section) {
            section.style.display = 'block';
        }
    });

    if (registerBtn && logoutBtn && userNameSpan) {
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        userNameSpan.style.display = 'inline-block';
    }

    // Load courses data after successful login
    loadCourses();
}

function showRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    const mainContent = document.querySelectorAll('.hero-section, .features-section, .contact-section, .courses-section');

    if (registerForm) {
        registerForm.style.display = 'block';
    }

    // Hide main content sections until user registers
    mainContent.forEach(section => {
        if (section) {
            section.style.display = 'none';
        }
    });
}

function handleLogout() {
    localStorage.removeItem('userData');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameSpan = document.querySelector('.user-name');
    const userName = document.getElementById('userName');

    if (registerBtn && logoutBtn && userNameSpan && userName) {
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        userNameSpan.style.display = 'none';
        userName.textContent = '';
    }
    showRegisterForm();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    const passwordInput = document.getElementById('password');
    const eyeBtn = document.getElementById('eyeBtn');
    const eyeIcon = eyeBtn.querySelector('i');

    eyeBtn.onclick = function() {
        // Toggle password visibility
        if(passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            eyeIcon.className = 'fas fa-eye';
        }
    }

    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = userData.fullName;
        }
        showCoursesSection();
    } else {
        showRegisterForm();
    }

    // Initialize counters
    initializeCounters();

    // Add event listeners
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const signupForm = document.getElementById('signupForm');

    if (registerBtn) {
        registerBtn.addEventListener('click', showRegisterForm);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validate fields
            if (!fullName || !email || !password) {
                showError({
                    ar: 'يرجى ملء جميع الحقول',
                    en: 'Please fill in all fields'
                });
                return;
            }

            // Validate password
            if (!validatePassword(password)) {
                showError({
                    ar: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، وحرف خاص',
                    en: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
                });
                return;
            }

            // Store user data
            const userData = { fullName, email };
            localStorage.setItem('userData', JSON.stringify(userData));

            // Update UI
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = fullName;
            }
            showCoursesSection();

            // Show success message
            showError({
                ar: 'تم التسجيل بنجاح!',
                en: 'Registration successful!'
            });
        });
    }
});
