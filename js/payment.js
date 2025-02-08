document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    // عرض اسم المستخدم
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userData.name || userData.fullName;
    }

    // استرجاع بيانات الكورس المحدد
    const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse'));
    if (!selectedCourse) {
        window.location.href = 'index.html';
        return;
    }

    // عرض تفاصيل الكورس
    const courseNameElement = document.getElementById('courseName');
    const coursePriceElement = document.getElementById('coursePrice');
    
    if (courseNameElement) {
        courseNameElement.textContent = selectedCourse.title;
    }
    if (coursePriceElement) {
        coursePriceElement.textContent = selectedCourse.price;
    }

    // معالجة نموذج الدفع
    const paymentForm = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');

    // تنسيق رقم البطاقة
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            // إضافة مسافة كل 4 أرقام
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }

    // معالجة تقديم النموذج
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // عرض رسالة المعالجة
            Swal.fire({
                title: 'جارٍ معالجة الدفع...',
                html: 'يرجى الانتظار...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // محاكاة عملية الدفع
            setTimeout(() => {
                // تحديث بيانات المستخدم
                userData.enrolledCourses = userData.enrolledCourses || [];
                userData.enrolledCourses.push(selectedCourse.id);
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // حذف بيانات الكورس المحدد
                localStorage.removeItem('selectedCourse');

                Swal.fire({
                    icon: 'success',
                    title: 'تم الدفع بنجاح!',
                    text: `تم تسجيلك بنجاح في دورة "${selectedCourse.title}"`,
                    confirmButtonText: 'حسناً'
                }).then(() => {
                    // العودة إلى الصفحة الرئيسية
                    window.location.href = 'index.html';
                });
            }, 2000);
        });
    }

    // تحديث النصوص حسب اللغة المحددة
    function updateTranslations(lang) {
        const translations = {
            ar: {
                'platform-name': 'منصة التعلم',
                'payment-details': 'تفاصيل الدفع',
                'price': 'السعر',
                'currency': 'جنيه',
                'card-holder': 'اسم حامل البطاقة',
                'card-number': 'رقم البطاقة',
                'expiry-date': 'تاريخ الانتهاء',
                'cvv': 'رمز CVV',
                'complete-payment': 'إتمام عملية الدفع',
                'available-payment': 'وسائل الدفع المتاحة',
                'translate': 'English'
            },
            en: {
                'platform-name': 'Learning Platform',
                'payment-details': 'Payment Details',
                'price': 'Price',
                'currency': 'EGP',
                'card-holder': 'Card Holder Name',
                'card-number': 'Card Number',
                'expiry-date': 'Expiry Date',
                'cvv': 'CVV Code',
                'complete-payment': 'Complete Payment',
                'available-payment': 'Available Payment Methods',
                'translate': 'عربي'
            }
        };

        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        // تحديث اتجاه الصفحة
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // تحديث اتجاه Bootstrap
        const bootstrapLink = document.querySelector('link[href*="bootstrap"]');
        if (bootstrapLink) {
            bootstrapLink.href = lang === 'ar' 
                ? 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css'
                : 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
        }
    }

    // زر الترجمة
    const translateBtn = document.getElementById('translateBtn');
    if (translateBtn) {
        translateBtn.addEventListener('click', function() {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            
            document.documentElement.lang = newLang;
            updateTranslations(newLang);
            
            // حفظ اللغة المحددة
            localStorage.setItem('selectedLanguage', newLang);
        });

        // تطبيق اللغة المحفوظة
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'ar';
        document.documentElement.lang = savedLanguage;
        updateTranslations(savedLanguage);
    }
});
