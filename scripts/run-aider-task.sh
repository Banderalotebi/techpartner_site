#!/bin/bash
# Aider Task Runner for TechPartner
# Usage: ./run-aider-task.sh <task_number>

TASK_FILE="$HOME/techpartner/AIDER_TASKS.md"
AIDER_BIN="/home/ubuntu/.local/bin/aider"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ ! -f "$AIDER_BIN" ]; then
    echo "❌ Aider not found at $AIDER_BIN"
    echo "Please install aider first"
    exit 1
fi

if [ -z "$1" ]; then
    echo "🚀 TechPartner Aider Task Runner"
    echo ""
    echo "Usage: ./run-aider-task.sh <task_number>"
    echo ""
    echo "Quick Wins (1-8):"
    echo "  1. Add Google Analytics 4"
    echo "  2. Create Favicon Set"
    echo "  3. Add Meta Tags for Social Sharing"
    echo "  4. Create 404 Error Page"
    echo "  5. Add Loading Skeletons"
    echo "  6. Scroll-to-Top Button"
    echo "  7. Cookie Consent Banner"
    echo "  8. Testimonials Component"
    echo ""
    echo "SEO Tasks (9-16):"
    echo "  9. Generate XML Sitemap"
    echo "  10. Add Structured Data"
    echo "  11. Create FAQ Page"
    echo "  12. Implement Blog System"
    echo "  13. Breadcrumb Navigation"
    echo "  14. Optimize Images"
    echo "  15. Service Comparison Table"
    echo "  16. Reading Time Estimator"
    echo ""
    echo "Conversion (17-24):"
    echo "  17. Email Capture Popups"
    echo "  18. Portfolio/Gallery Page"
    echo "  19. Live Chat Widget"
    echo "  20. Pricing Calculator"
    echo "  21. Trust Badges"
    echo "  22. Referral System"
    echo "  23. Booking Calendar"
    echo "  24. Video Testimonials"
    echo ""
    echo "Automation (25-30):"
    echo "  25. Competitor Price Monitor"
    echo "  26. SEO Rank Tracker"
    echo "  27. Content Scraper"
    echo "  28. Review Aggregator"
    echo "  29. Automated Reporting"
    echo "  30. AI Content Pipeline"
    echo ""
    echo "Or run: cat AIDER_TASKS.md for full details"
    exit 0
fi

TASK_NUM=$1

case $TASK_NUM in
    1)
        echo -e "${GREEN}Task 1: Add Google Analytics 4${NC}"
        cd ~/techpartner && $AIDER_BIN client/index.html
        ;;
    2)
        echo -e "${GREEN}Task 2: Create Favicon Set${NC}"
        cd ~/techpartner && $AIDER_BIN client/index.html public/
        ;;
    3)
        echo -e "${GREEN}Task 3: Add Meta Tags for Social Sharing${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/SEO.tsx client/index.html
        ;;
    4)
        echo -e "${GREEN}Task 4: Create 404 Error Page${NC}"
        cd ~/techpartner && $AIDER_BIN client/pages/404.tsx server/static-handler.ts
        ;;
    5)
        echo -e "${GREEN}Task 5: Add Loading Skeletons${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/LoadingSpinner.tsx
        ;;
    6)
        echo -e "${GREEN}Task 6: Scroll-to-Top Button${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/Footer.tsx
        ;;
    7)
        echo -e "${GREEN}Task 7: Cookie Consent Banner${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/ client/App.tsx
        ;;
    8)
        echo -e "${GREEN}Task 8: Testimonials Component${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/Testimonials.tsx
        ;;
    9)
        echo -e "${GREEN}Task 9: Generate XML Sitemap${NC}"
        cd ~/techpartner && $AIDER_BIN server/routes/sitemap.ts
        ;;
    10)
        echo -e "${GREEN}Task 10: Add Structured Data${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/SEO.tsx
        ;;
    11)
        echo -e "${GREEN}Task 11: Create FAQ Page${NC}"
        cd ~/techpartner && $AIDER_BIN client/pages/FAQ.tsx server/routes/content.ts
        ;;
    12)
        echo -e "${GREEN}Task 12: Implement Blog System${NC}"
        cd ~/techpartner && $AIDER_BIN server/routes/blog.ts shared/schema.ts
        ;;
    13)
        echo -e "${GREEN}Task 13: Breadcrumb Navigation${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/Breadcrumb.tsx
        ;;
    14)
        echo -e "${GREEN}Task 14: Optimize Images${NC}"
        cd ~/techpartner && $AIDER_BIN vite.config.ts
        ;;
    15)
        echo -e "${GREEN}Task 15: Service Comparison Table${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/ServiceComparison.tsx
        ;;
    16)
        echo -e "${GREEN}Task 16: Reading Time Estimator${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/
        ;;
    17)
        echo -e "${GREEN}Task 17: Email Capture Popups${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/EmailCapture.tsx server/routes/crm.ts
        ;;
    18)
        echo -e "${GREEN}Task 18: Portfolio/Gallery Page${NC}"
        cd ~/techpartner && $AIDER_BIN client/pages/Portfolio.tsx
        ;;
    19)
        echo -e "${GREEN}Task 19: Live Chat Widget${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/LiveChat.tsx server/routes/chat.ts
        ;;
    20)
        echo -e "${GREEN}Task 20: Pricing Calculator${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/PricingCalculator.tsx
        ;;
    21)
        echo -e "${GREEN}Task 21: Trust Badges${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/TrustBadges.tsx
        ;;
    22)
        echo -e "${GREEN}Task 22: Referral System${NC}"
        cd ~/techpartner && $AIDER_BIN server/routes/referrals.ts shared/schema.ts
        ;;
    23)
        echo -e "${GREEN}Task 23: Booking Calendar${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/BookingCalendar.tsx server/routes/booking.ts
        ;;
    24)
        echo -e "${GREEN}Task 24: Video Testimonials${NC}"
        cd ~/techpartner && $AIDER_BIN client/components/VideoTestimonials.tsx
        ;;
    25)
        echo -e "${GREEN}Task 25: Competitor Price Monitor${NC}"
        cd ~/techpartner && $AIDER_BIN scripts/price-monitor.ts
        ;;
    26)
        echo -e "${GREEN}Task 26: SEO Rank Tracker${NC}"
        cd ~/techpartner && $AIDER_BIN scripts/rank-tracker.ts
        ;;
    27)
        echo -e "${GREEN}Task 27: Content Scraper${NC}"
        cd ~/techpartner && $AIDER_BIN scripts/trend-scraper.ts
        ;;
    28)
        echo -e "${GREEN}Task 28: Review Aggregator${NC}"
        cd ~/techpartner && $AIDER_BIN scripts/review-aggregator.ts
        ;;
    29)
        echo -e "${GREEN}Task 29: Automated Reporting${NC}"
        cd ~/techpartner && $AIDER_BIN scripts/weekly-report.ts
        ;;
    30)
        echo -e "${GREEN}Task 30: AI Content Pipeline${NC}"
        cd ~/techpartner && $AIDER_BIN scripts/ai-content-pipeline.ts
        ;;
    *)
        echo -e "${YELLOW}Invalid task number. Please choose 1-30.${NC}"
        exit 1
        ;;
esac
