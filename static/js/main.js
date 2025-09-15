// Main JavaScript for Transformations Flask

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPasswordToggle();
    initFormValidation();
    initAnimations();
    initTooltips();
    initAlerts();
});

// Password Toggle Functionality
function initPasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    
    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
        
        // Password strength indicator
        passwordField.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
}

// Password strength validation
function updatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    const progressBar = strengthIndicator?.querySelector('.progress-bar');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (!strengthIndicator || !progressBar || !strengthText) return;
    
    if (password.length === 0) {
        strengthIndicator.style.display = 'none';
        return;
    }
    
    strengthIndicator.style.display = 'block';
    
    const strength = calculatePasswordStrength(password);
    const percentage = strength.score * 25; // Convert to percentage
    
    progressBar.style.width = `${percentage}%`;
    progressBar.className = `progress-bar ${strength.class}`;
    strengthText.textContent = strength.text;
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 6) score++;
    else feedback.push('at least 6 characters');
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    else feedback.push('lowercase letters');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('uppercase letters');
    
    if (/[0-9]/.test(password)) score++;
    else feedback.push('numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('special characters');
    
    // Determine strength level
    let strength = { score: 0, class: '', text: '' };
    
    if (score <= 2) {
        strength = { score: 1, class: 'bg-danger', text: 'Weak password' };
    } else if (score <= 4) {
        strength = { score: 2, class: 'bg-warning', text: 'Fair password' };
    } else if (score <= 6) {
        strength = { score: 3, class: 'bg-info', text: 'Good password' };
    } else {
        strength = { score: 4, class: 'bg-success', text: 'Strong password' };
    }
    
    // Add feedback for missing elements
    if (feedback.length > 0 && score < 4) {
        strength.text += ` (consider adding ${feedback.slice(0, 2).join(', ')})`;
    }
    
    return strength;
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        // Real-time validation on input
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        // Form submission validation
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            let isFormValid = true;
            
            // Validate all fields
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });
            
            // Custom validation rules
            if (!validateCustomRules(form)) {
                isFormValid = false;
            }
            
            if (isFormValid) {
                // Hide validation summary
                hideValidationSummary();
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                showLoading(submitBtn);
                
                // Simulate form submission (replace with actual AJAX call)
                setTimeout(() => {
                    hideLoading(submitBtn);
                    form.submit();
                }, 1000);
            } else {
                // Show validation summary
                showValidationSummary(form);
                
                // Focus on first invalid field
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
            
            form.classList.add('was-validated');
        });
    });
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous validation states
    field.classList.remove('is-valid', 'is-invalid');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = getFieldErrorMessage(fieldName, 'required');
    }
    
    // Type-specific validation
    if (value && isValid) {
        switch (fieldType) {
            case 'email':
                if (!isValidEmail(value)) {
                    isValid = false;
                    errorMessage = getFieldErrorMessage(fieldName, 'email');
                }
                break;
            case 'password':
                if (!isValidPassword(value)) {
                    isValid = false;
                    errorMessage = getFieldErrorMessage(fieldName, 'password');
                }
                break;
            case 'text':
                if (fieldName === 'username') {
                    if (!isValidUsername(value)) {
                        isValid = false;
                        errorMessage = getFieldErrorMessage(fieldName, 'username');
                    }
                }
                break;
        }
    }
    
    // Length validation
    if (value && isValid) {
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        if (minLength && value.length < parseInt(minLength)) {
            isValid = false;
            errorMessage = getFieldErrorMessage(fieldName, 'minlength', minLength);
        }
        
        if (maxLength && value.length > parseInt(maxLength)) {
            isValid = false;
            errorMessage = getFieldErrorMessage(fieldName, 'maxlength', maxLength);
        }
    }
    
    // Update field appearance
    if (isValid && value) {
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
    } else if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
    }
    
    // Update error message
    updateFieldErrorMessage(field, errorMessage);
    
    return isValid;
}

// Custom validation rules
function validateCustomRules(form) {
    let isValid = true;
    
    // Username validation
    const username = form.querySelector('input[name="username"]');
    if (username && username.value.trim()) {
        if (!isValidUsername(username.value.trim())) {
            isValid = false;
        }
    }
    
    // Password validation
    const password = form.querySelector('input[name="password"]');
    if (password && password.value.trim()) {
        if (!isValidPassword(password.value.trim())) {
            isValid = false;
        }
    }
    
    return isValid;
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // Password must be at least 6 characters
    return password.length >= 6;
}

function isValidUsername(username) {
    // Username must be 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

// Get field-specific error messages
function getFieldErrorMessage(fieldName, errorType, value = null) {
    const messages = {
        username: {
            required: 'Username is required',
            username: 'Username must be 3-20 characters, letters, numbers, and underscores only',
            minlength: `Username must be at least ${value} characters`,
            maxlength: `Username must be no more than ${value} characters`
        },
        password: {
            required: 'Password is required',
            password: 'Password must be at least 6 characters long',
            minlength: `Password must be at least ${value} characters`,
            maxlength: `Password must be no more than ${value} characters`
        },
        email: {
            required: 'Email is required',
            email: 'Please enter a valid email address'
        }
    };
    
    return messages[fieldName]?.[errorType] || 'Please enter a valid value';
}

// Update field error message
function updateFieldErrorMessage(field, message) {
    let feedbackElement = field.parentNode.querySelector('.invalid-feedback');
    
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'invalid-feedback';
        field.parentNode.appendChild(feedbackElement);
    }
    
    feedbackElement.textContent = message;
}

// Show validation summary
function showValidationSummary(form) {
    const summary = document.getElementById('formValidationSummary');
    const errorsList = document.getElementById('validationErrorsList');
    
    if (!summary || !errorsList) return;
    
    // Clear previous errors
    errorsList.innerHTML = '';
    
    // Collect all validation errors
    const invalidFields = form.querySelectorAll('.is-invalid');
    const errors = [];
    
    invalidFields.forEach(field => {
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback && feedback.textContent) {
            const label = field.previousElementSibling?.textContent || field.name;
            errors.push(`${label}: ${feedback.textContent}`);
        }
    });
    
    // Add errors to list
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorsList.appendChild(li);
    });
    
    // Show summary
    summary.classList.remove('d-none');
    
    // Scroll to summary
    summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hide validation summary
function hideValidationSummary() {
    const summary = document.getElementById('formValidationSummary');
    if (summary) {
        summary.classList.add('d-none');
    }
}

// Animations
function initAnimations() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
    
    // Add slide-in animations to login form elements
    const loginForm = document.querySelector('.login-form-container');
    if (loginForm) {
        const formElements = loginForm.querySelectorAll('.form-control, .btn');
        formElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('slide-in-left');
        });
    }
}

// Tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Auto-dismiss alerts
function initAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

// Utility Functions
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to toast container
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    toastContainer.appendChild(toast);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove from DOM after hiding
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Form submission with loading state
function submitFormWithLoading(form, callback) {
    const submitBtn = form.querySelector('button[type="submit"]');
    
    showLoading(submitBtn);
    
    // Simulate form submission (replace with actual AJAX call)
    setTimeout(() => {
        hideLoading(submitBtn);
        if (callback) callback();
    }, 2000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.querySelector('form');
        if (form) {
            form.submit();
        }
    }
    
    // Escape to close modals/alerts
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal) {
            const modal = bootstrap.Modal.getInstance(activeModal);
            if (modal) modal.hide();
        }
        
        const alerts = document.querySelectorAll('.alert.show');
        alerts.forEach(alert => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }
});

// Theme toggle (if needed in future)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-bs-theme', savedTheme);
    }
}

// Initialize theme on page load
loadTheme();

// Export functions for global use
window.TransformationsFlask = {
    showToast,
    showLoading,
    hideLoading,
    submitFormWithLoading,
    toggleTheme
};
