// AI Support Bot Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Aurora effect mouse follow
    const auroraBg = document.querySelector('.aurora-background');
    if (auroraBg) {
        auroraBg.addEventListener('mousemove', (e) => {
            const rect = auroraBg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            auroraBg.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            auroraBg.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });
    }
    
    // On-scroll animations
    const animatedElements = document.querySelectorAll('[data-scroll-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // ROI Calculator with Lead Capture
    const roiForm = document.getElementById('roiForm');
    const roiResults = document.getElementById('roiResults');
    const roiInputs = roiForm ? roiForm.querySelectorAll('input') : [];
    let currentROIData = null;

    function calculateROI() {
        const tickets = parseFloat(document.getElementById('tickets').value) || 0;
        const hoursPerTicket = parseFloat(document.getElementById('hoursPerTicket').value) || 0;
        const wage = parseFloat(document.getElementById('wage').value) || 0;

        const totalMonthlyCost = tickets * hoursPerTicket * wage;
        const monthlySavings = totalMonthlyCost * 0.40;
        const roundedSavings = Math.round(monthlySavings / 50) * 50;

        // Store current ROI data for lead capture
        currentROIData = {
            tickets,
            hoursPerTicket,
            wage,
            totalMonthlyCost,
            monthlySavings,
            roundedSavings
        };

        if (roiResults) {
            if (totalMonthlyCost > 0) {
                roiResults.innerHTML = `
                    <p class="text-lg text-white">
                        You're burning <span class="font-bold text-2xl text-red-400">${totalMonthlyCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span> every month on repetitive support.
                    </p>
                    <p class="mt-2 text-lg text-white">
                        Our bot reduces this by 40% = <span class="font-bold text-2xl text-green-400">${monthlySavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} saved monthly.</span>
                    </p>
                    <div class="mt-6 flex flex-col gap-3">
                        <a href="#audit-cal" class="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105">
                            Lock in ${roundedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo savings → book audit
                        </a>
                        <button id="getCustomReportBtn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105">
                            Get Custom Savings Report (Free)
                        </button>
                    </div>
                `;
                
                // Add event listener to the new button
                const customReportBtn = document.getElementById('getCustomReportBtn');
                if (customReportBtn) {
                    customReportBtn.addEventListener('click', showLeadCaptureForm);
                }
            } else {
                roiResults.innerHTML = `<p class="text-slate-400">Enter your store's data to see your potential savings.</p>`;
            }
        }
    }

    function showLeadCaptureForm() {
        trackEvent('ClickedCustomReport', { savingsAmount: currentROIData?.monthlySavings || 0 });
        
        if (!currentROIData || currentROIData.totalMonthlyCost <= 0) {
            alert('Please calculate your ROI first');
            return;
        }

        const formHTML = `
            <div id="leadCaptureModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-slate-800 p-8 rounded-lg max-w-md w-full">
                    <h3 class="text-2xl font-bold text-white mb-4">Get Your Custom Savings Report</h3>
                    <p class="text-slate-300 mb-6">We'll send you a personalized analysis showing exactly how to save ${currentROIData.roundedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}/month with our AI bot.</p>
                    
                    <form id="leadCaptureForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                            <input type="email" id="leadEmail" required class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Name *</label>
                            <input type="text" id="leadName" required class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Company/Store Name</label>
                            <input type="text" id="leadCompany" class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">Phone (optional)</label>
                            <input type="tel" id="leadPhone" class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500">
                        </div>
                        
                        <div class="flex gap-3 mt-6">
                            <button type="submit" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition">
                                Get My Report
                            </button>
                            <button type="button" id="closeLead" class="px-4 py-3 text-slate-300 hover:text-white transition">
                                Cancel
                            </button>
                        </div>
                    </form>
                    
                    <p class="text-xs text-slate-400 mt-4">We'll also include a free 15-min strategy call to discuss implementation.</p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', formHTML);

        // Add event listeners
        document.getElementById('closeLead').addEventListener('click', closeLeadCaptureForm);
        document.getElementById('leadCaptureModal').addEventListener('click', (e) => {
            if (e.target.id === 'leadCaptureModal') closeLeadCaptureForm();
        });
        document.getElementById('leadCaptureForm').addEventListener('submit', handleLeadSubmission);
    }

    function closeLeadCaptureForm() {
        const modal = document.getElementById('leadCaptureModal');
        if (modal) modal.remove();
    }

    async function handleLeadSubmission(e) {
        e.preventDefault();
        
        const email = document.getElementById('leadEmail').value;
        const name = document.getElementById('leadName').value;
        const company = document.getElementById('leadCompany').value;
        const phone = document.getElementById('leadPhone').value;

        const leadData = {
            email,
            name,
            company,
            phone,
            monthlyTickets: currentROIData.tickets,
            currentMonthlyCost: currentROIData.totalMonthlyCost,
            potentialSavings: currentROIData.monthlySavings,
            source: 'roi-calculator'
        };

        try {
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const response = await fetch('/api/capture-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                trackEvent('LeadCaptured', { 
                    email,
                    savingsAmount: currentROIData.monthlySavings,
                    source: 'roi-calculator'
                });

                // Success message
                document.getElementById('leadCaptureModal').innerHTML = `
                    <div class="bg-slate-800 p-8 rounded-lg max-w-md w-full text-center">
                        <div class="text-green-400 text-4xl mb-4">✓</div>
                        <h3 class="text-2xl font-bold text-white mb-4">Report Sent!</h3>
                        <p class="text-slate-300 mb-6">Check your email for your custom savings report. We'll also reach out within 24 hours to schedule your free strategy call.</p>
                        <button id="closeSuccess" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition">
                            Continue to Booking
                        </button>
                    </div>
                `;

                document.getElementById('closeSuccess').addEventListener('click', () => {
                    closeLeadCaptureForm();
                    // Scroll to booking section
                    document.getElementById('audit-cal').scrollIntoView({ behavior: 'smooth' });
                });

                // Auto-close after 5 seconds
                setTimeout(() => {
                    closeLeadCaptureForm();
                    document.getElementById('audit-cal').scrollIntoView({ behavior: 'smooth' });
                }, 5000);

            } else {
                throw new Error(result.error || 'Failed to capture lead');
            }

        } catch (error) {
            console.error('Lead capture error:', error);
            alert('Sorry, there was an error sending your report. Please try again or book a call directly.');
            
            // Reset button
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Get My Report';
            submitBtn.disabled = false;
        }
    }

    if (roiForm) {
        roiInputs.forEach(input => input.addEventListener('input', calculateROI));
        calculateROI(); // Initial calculation on page load
    }

    // Analytics tracking (placeholder functions)
    window.trackEvent = function(eventName, properties = {}) {
        // Track with Meta Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, properties);
        }
        
        // Track with Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        console.log('Event tracked:', eventName, properties);
    };

    // Enhanced Analytics Tracking
    let pageStartTime = Date.now();
    let roiCalculatorUsed = false;
    let maxSavingsCalculated = 0;

    // Track page engagement
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
        trackEvent('PageEngagement', { 
            timeOnPage, 
            roiCalculatorUsed, 
            maxSavingsCalculated 
        });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            
            // Track milestone scroll depths
            if (scrollPercent >= 25 && scrollPercent < 50) {
                trackEvent('ScrollDepth', { depth: '25%' });
            } else if (scrollPercent >= 50 && scrollPercent < 75) {
                trackEvent('ScrollDepth', { depth: '50%' });
            } else if (scrollPercent >= 75 && scrollPercent < 100) {
                trackEvent('ScrollDepth', { depth: '75%' });
            } else if (scrollPercent >= 100) {
                trackEvent('ScrollDepth', { depth: '100%' });
            }
        }
    });

    // Track important interactions
    document.addEventListener('click', (e) => {
        if (e.target.closest('[href="#audit-cal"]')) {
            trackEvent('ClickedBookAudit', { 
                source: e.target.closest('.hero') ? 'hero_cta' : 'roi_calculator',
                savingsAmount: currentROIData?.monthlySavings || 0
            });
        }
        
        if (e.target.closest('a[href*="cal.com"]')) {
            trackEvent('OpenedCalendar', { source: 'embedded_calendar' });
        }

        if (e.target.closest('[href="#roi-calculator"]')) {
            trackEvent('ClickedROICalculator', { source: 'navigation' });
        }
    });

    // Track ROI calculator usage with more detail
    if (roiForm) {
        let calculationTimeout;
        
        roiInputs.forEach(input => {
            input.addEventListener('input', () => {
                roiCalculatorUsed = true;
                
                // Debounce tracking to avoid spam
                clearTimeout(calculationTimeout);
                calculationTimeout = setTimeout(() => {
                    const tickets = parseFloat(document.getElementById('tickets').value) || 0;
                    const hoursPerTicket = parseFloat(document.getElementById('hoursPerTicket').value) || 0;
                    const wage = parseFloat(document.getElementById('wage').value) || 0;
                    const monthlySavings = tickets * hoursPerTicket * wage * 0.40;
                    
                    if (monthlySavings > maxSavingsCalculated) {
                        maxSavingsCalculated = monthlySavings;
                    }
                    
                    trackEvent('ROICalculated', {
                        tickets,
                        hoursPerTicket,
                        wage,
                        monthlySavings,
                        savingsRange: getSavingsRange(monthlySavings)
                    });
                }, 1000);
            });
        });
    }

    // Helper function to categorize savings amounts
    function getSavingsRange(savings) {
        if (savings < 1000) return 'under_1k';
        if (savings < 5000) return '1k_to_5k';
        if (savings < 10000) return '5k_to_10k';
        if (savings < 25000) return '10k_to_25k';
        return 'over_25k';
    }

    // Track form field interactions
    document.addEventListener('focus', (e) => {
        if (e.target.matches('#tickets, #hoursPerTicket, #wage')) {
            trackEvent('FocusedROIField', { field: e.target.id });
        }
    }, true);

    // Track mobile vs desktop usage
    const isMobile = window.innerWidth <= 768;
    trackEvent('DeviceType', { 
        type: isMobile ? 'mobile' : 'desktop',
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
    });
});