# -*- coding: utf-8 -*-
"""
================================================================================
SMART INDIA HACKATHON (SIH 2026) - Presentation Automation Engine
Problem Statement: SIH26204 | Theme: Travel & Tourism | Category: Software
Team: Rawauthentic
Lead Developer: Sahil Jadhav (sahilujadhav143@gmail.com)
================================================================================
Builds pixel-perfect 16:9 widescreen presentation matching the official SIH template:
- Slide 1: Title & Team Information
- Slide 2: Proposed Solution & Problem Resolution
- Slide 3: Technical Architecture & Development Workflow
- Slide 4: Feasibility, Viability & Risk Mitigations
- Slide 5: Real-World Impact & Stakeholder Benefits
- Slide 6: Research References (DOIs) & Competitive Comparison Matrix
================================================================================
"""
import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_sih_official_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Official Palette
    NAVY = RGBColor(15, 23, 42)         # #0f172a
    DARK_BLUE = RGBColor(30, 58, 138)     # #1e3a8a
    BLUE = RGBColor(37, 99, 235)         # #2563eb
    CYAN = RGBColor(14, 165, 233)        # #0ea5e9
    ORANGE = RGBColor(234, 88, 12)       # #ea580c (SIH Orange)
    GREEN = RGBColor(16, 185, 129)       # #10b981
    BG_LIGHT = RGBColor(248, 250, 252)    # #f8fafc
    WHITE = RGBColor(255, 255, 255)
    CARD_BG = RGBColor(255, 255, 255)
    TEXT_DARK = RGBColor(15, 23, 42)
    TEXT_MUTED = RGBColor(100, 116, 139)
    BORDER_LIGHT = RGBColor(226, 232, 240)
    BORDER_BLUE = RGBColor(191, 219, 254)
    BADGE_BG = RGBColor(239, 246, 255)

    def set_bg(slide):
        bg = slide.background
        fill = bg.fill
        fill.solid()
        fill.fore_color.rgb = BG_LIGHT

    def add_common_header(slide, slide_title, slide_num):
        # Top Header Bar
        hdr = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.15))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = WHITE
        hdr.line.color.rgb = BORDER_LIGHT
        hdr.line.width = Pt(1)

        # Team Badge Left
        tb = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(0.3), Inches(2.2), Inches(0.55))
        tb.fill.solid()
        tb.fill.fore_color.rgb = NAVY
        tb.line.color.rgb = NAVY
        tf = tb.text_frame
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = "Rawauthentic"
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = WHITE

        # Center Title
        tx = slide.shapes.add_textbox(Inches(2.8), Inches(0.18), Inches(7.5), Inches(0.8))
        tf = tx.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = slide_title
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = NAVY

        # Right SIH Badge
        sb = slide.shapes.add_textbox(Inches(10.5), Inches(0.15), Inches(2.5), Inches(0.85))
        tf = sb.text_frame
        p = tf.paragraphs[0]
        p.text = "SMART INDIA HACKATHON\n2026"
        p.alignment = PP_ALIGN.RIGHT
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = ORANGE

        # Bottom Footer
        ftr = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.1), Inches(13.333), Inches(0.4))
        ftr.fill.solid()
        ftr.fill.fore_color.rgb = WHITE
        ftr.line.color.rgb = BORDER_LIGHT
        ftr.line.width = Pt(1)

        tx_ftr = slide.shapes.add_textbox(Inches(0.6), Inches(7.12), Inches(10.0), Inches(0.35))
        tf = tx_ftr.text_frame
        p = tf.paragraphs[0]
        p.text = "@SIH Idea submission- Template"
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_MUTED

        tx_pg = slide.shapes.add_textbox(Inches(12.2), Inches(7.12), Inches(0.8), Inches(0.35))
        tf = tx_pg.text_frame
        p = tf.paragraphs[0]
        p.text = str(slide_num)
        p.alignment = PP_ALIGN.RIGHT
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    # Top Header Banner
    top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.3))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = WHITE
    top_bar.line.color.rgb = BORDER_LIGHT

    tx = s1.shapes.add_textbox(Inches(0.6), Inches(0.2), Inches(9.5), Inches(0.9))
    tf = tx.text_frame
    p = tf.paragraphs[0]
    p.text = "SMART INDIA HACKATHON 2026"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    p = tf.add_paragraph()
    p.text = "TITLE PAGE"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY

    # Right SIH text badge
    sb = s1.shapes.add_textbox(Inches(10.2), Inches(0.25), Inches(2.6), Inches(0.85))
    tf = sb.text_frame
    p = tf.paragraphs[0]
    p.text = "SMART INDIA\nHACKATHON\n2026"
    p.alignment = PP_ALIGN.RIGHT
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ORANGE

    # Left Details Card
    card1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(1.6), Inches(7.6), Inches(5.2))
    card1.fill.solid()
    card1.fill.fore_color.rgb = WHITE
    card1.line.color.rgb = BORDER_BLUE
    card1.line.width = Pt(1.5)

    tf = card1.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.4)
    tf.margin_top = Inches(0.35)

    items = [
        ("• Problem Statement ID:", " SIH26204"),
        ("• Problem Statement Title:", " Student Innovation - A solution/idea that can boost the current situation of the tourism industries including hotels, travel and others."),
        ("• Theme:", " Travel & Tourism"),
        ("• PS Category:", " Software"),
        ("• Team ID:", " Rawauthentic-SIH26"),
        ("• Team Name:", " Rawauthentic"),
        ("• Proposed Solution:", " SmartTour Connect (TourSetu AI) — An AI-Powered Smart Tourism, Direct Stay & Sustainable Travel Grid Platform")
    ]

    for i, (label, val) in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(10)
        
        run1 = p.add_run()
        run1.text = label
        run1.font.bold = True
        run1.font.size = Pt(13)
        run1.font.color.rgb = DARK_BLUE

        run2 = p.add_run()
        run2.text = val
        run2.font.bold = (label in ["• Problem Statement ID:", "• Team Name:", "• Proposed Solution:"])
        run2.font.size = Pt(13)
        run2.font.color.rgb = TEXT_DARK if not run2.font.bold else ORANGE

    # Right Illustration / Project Highlight Card
    card_r = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.5), Inches(1.6), Inches(4.2), Inches(5.2))
    card_r.fill.solid()
    card_r.fill.fore_color.rgb = NAVY
    card_r.line.color.rgb = ORANGE
    card_r.line.width = Pt(2)

    tf_r = card_r.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = Inches(0.35)
    tf_r.margin_top = Inches(0.4)

    p = tf_r.paragraphs[0]
    p.text = "🌐 SmartTour Connect"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = CYAN
    p.space_after = Pt(12)

    p = tf_r.add_paragraph()
    p.text = "NEXT-GEN AI TOURISM & TRANSIT GRID"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ORANGE
    p.space_after = Pt(16)

    bullets = [
        "✓ 0% Commission Direct Hotel & Stay Bookings",
        "✓ Dynamic AI Itinerary & Smart Budget Planner",
        "✓ Real-time Crowd Density & Capacity Grid",
        "✓ Instant QR Digital Boarding & Eco-Pass",
        "✓ 24/7 Web Audio Hardware Emergency SOS",
        "✓ Multi-Format Triple-Sync Ledger DB"
    ]
    for b in bullets:
        p = tf_r.add_paragraph()
        p.text = b
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p.space_after = Pt(8)

    # Footer for slide 1
    ftr1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.1), Inches(13.333), Inches(0.4))
    ftr1.fill.solid()
    ftr1.fill.fore_color.rgb = WHITE
    ftr1.line.color.rgb = BORDER_LIGHT
    tx_f1 = s1.shapes.add_textbox(Inches(0.6), Inches(7.12), Inches(10.0), Inches(0.35))
    tx_f1.text_frame.paragraphs[0].text = "@SIH Idea submission- Template"
    tx_f1.text_frame.paragraphs[0].font.size = Pt(9.5)
    tx_f1.text_frame.paragraphs[0].font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 2: IDEA TITLE & PROPOSED SOLUTION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_common_header(s2, "IDEA TITLE", 2)

    # Left Column: Proposed Solution & Problem Resolution
    card_s2_l = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(1.35), Inches(5.8), Inches(5.5))
    card_s2_l.fill.solid()
    card_s2_l.fill.fore_color.rgb = WHITE
    card_s2_l.line.color.rgb = BORDER_BLUE
    card_s2_l.line.width = Pt(1.5)

    tf2_l = card_s2_l.text_frame
    tf2_l.word_wrap = True
    tf2_l.margin_left = Inches(0.35)
    tf2_l.margin_top = Inches(0.3)

    p = tf2_l.paragraphs[0]
    p.text = "Proposed Solution :-"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(8)

    sol_bullets = [
        "• SmartTour Connect is an AI-powered integrated digital platform designed to improve the tourism industry by connecting tourists, hotels, travel agencies, local guides, restaurants, transport providers, and local businesses on one smart platform.",
        "• Improves tourist convenience, promotes local businesses and employment, reduces overcrowding, supports sustainable tourism, and creates a connected tourism ecosystem.",
        "• AI Trip Planner: Personalized itineraries, hotels, transport, activities, and dynamic budgets.",
        "• Tourism Hub: Connects tourists with verified hotels, guides, restaurants, and local businesses.",
        "• Smart & Safe Travel: Provides crowd management, safety support, reviews, and smart recommendations."
    ]
    for b in sol_bullets:
        p = tf2_l.add_paragraph()
        p.text = b
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(6)

    p = tf2_l.add_paragraph()
    p.text = "Problem Resolution :-"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(6)

    p = tf2_l.add_paragraph()
    p.text = "SmartTour Connect is an AI-powered one-stop platform for smarter travel planning. It provides personalized itineraries, hotel/activity recommendations, and budget planning. It connects tourists with verified local services and provides safety and crowd updates. It also promotes local businesses and enhances the overall travel experience."
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_DARK

    # Right Column: Ecosystem Architecture & Modules Grid
    card_s2_r = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.5), Inches(1.35), Inches(6.3), Inches(5.5))
    card_s2_r.fill.solid()
    card_s2_r.fill.fore_color.rgb = WHITE
    card_s2_r.line.color.rgb = BORDER_BLUE
    card_s2_r.line.width = Pt(1.5)

    tf2_r = card_s2_r.text_frame
    tf2_r.word_wrap = True
    tf2_r.margin_left = Inches(0.3)
    tf2_r.margin_top = Inches(0.25)

    p = tf2_r.paragraphs[0]
    p.text = "SmartTour Connect — Stakeholder Ecosystem & Modules"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(8)

    # 6 Modules Structured in Cards
    modules = [
        ("📱 Traveler Dashboard & PWA", "Personalized recommendations, live weather, transit heatmaps, offline booking slips."),
        ("🤖 AI Trip & Budget Planner", "Day-wise smart itineraries, expense breakdown, multi-currency conversion (₹, $, €, £, ¥)."),
        ("🏨 Direct Hotel & Stay Engine", "0% OTA commission, direct host connection, dynamic pricing & room reservation."),
        ("🗺️ Local Guides & Experiences", "Verified local experts, eco-trails, cultural food walks & artisan craft promotion."),
        ("🚨 Smart Safety & Crowd SOS", "Real-time crowd heatmaps, hardware Web Audio SOS synthesizer & GPS distress beacon."),
        ("📊 Admin & B2G Tourism Hub", "Central business verification, booking ledger management, state tourism analytics.")
    ]

    for title, desc in modules:
        p = tf2_r.add_paragraph()
        run = p.add_run()
        run.text = title + ": "
        run.font.bold = True
        run.font.size = Pt(10.5)
        run.font.color.rgb = BLUE

        run2 = p.add_run()
        run2.text = desc
        run2.font.size = Pt(10)
        run2.font.color.rgb = TEXT_MUTED
        p.space_after = Pt(5)

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_common_header(s3, "TECHNICAL APPROACH", 3)

    # Top Section: Technologies Used (4 Cards)
    tech_categories = [
        ("🎨 Frontend (PWA)", ["HTML5 & Tailwind CSS", "JavaScript (ES6+)", "Three.js (3D Earth)", "Leaflet.js (GIS Map)", "Web Audio (SOS Siren)"], BLUE),
        ("🐍 Backend Server", ["Python 3 Native HTTP", "Zero External Pip Libs", "REST API & CORS", "Threading Daemons", "Cloud Relay Worker"], DARK_BLUE),
        ("📁 Multi-Ledger DB", ["backend_db.json (Store)", "backend_bookings.csv", "backend_summary.txt", "Triple-Sync Engine", "Zero Data Loss"], GREEN),
        ("🛡️ Edge Networking", ["Cloudflare Tunnel", "HTTPS SSL/TLS", "Geolocation GPS API", "PWA Service Worker", "Git & GitHub CI/CD"], ORANGE)
    ]

    for idx, (cat_title, bullet_items, cat_color) in enumerate(tech_categories):
        x = Inches(0.5 + idx * 3.1)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.35), Inches(2.95), Inches(2.7))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = cat_color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = cat_title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = cat_color
        p.space_after = Pt(8)

        for b in bullet_items:
            p = tf.add_paragraph()
            p.text = "• " + b
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_DARK
            p.space_after = Pt(4)

    # Bottom Section: End-to-End Development Flow (7 Steps)
    flow_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(4.2), Inches(12.333), Inches(2.65))
    flow_box.fill.solid()
    flow_box.fill.fore_color.rgb = WHITE
    flow_box.line.color.rgb = BORDER_BLUE
    flow_box.line.width = Pt(1.5)

    tf_flow = flow_box.text_frame
    tf_flow.word_wrap = True
    tf_flow.margin_left = Inches(0.3)
    tf_flow.margin_top = Inches(0.2)

    p = tf_flow.paragraphs[0]
    p.text = "⚙️ End-to-End Development & Implementation Flow"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(10)

    steps = [
        ("1. Plan & Design", "Requirement analysis, user persona & Figma UI/UX architecture"),
        ("2. PWA Frontend", "Responsive UI, Three.js 3D Earth, Leaflet Maps, Web Audio SOS"),
        ("3. Python Backend", "Python 3 REST API, zero-dependency multithreaded server"),
        ("4. Triple-Sync DB", "Simultaneous save to JSON store, Excel CSV & Text receipts"),
        ("5. Security & Tunnel", "Cloudflare Zero-Trust edge tunneling for global HTTPS access"),
        ("6. Testing & CI/CD", "Cross-browser mobile PWA testing, GPS verification & GitHub versioning"),
        ("7. Deployment", "1-click local launcher + edge cloud live deployment")
    ]

    for step_num, step_desc in steps:
        p = tf_flow.add_paragraph()
        run = p.add_run()
        run.text = step_num + " → "
        run.font.bold = True
        run.font.size = Pt(11)
        run.font.color.rgb = BLUE

        run2 = p.add_run()
        run2.text = step_desc
        run2.font.size = Pt(10.5)
        run2.font.color.rgb = TEXT_DARK
        p.space_after = Pt(3.5)

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_common_header(s4, "FEASIBILITY AND VIABILITY", 4)

    # Left: Feasibility & Challenges (5.9 Inches)
    card_s4_l = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(1.35), Inches(5.9), Inches(5.5))
    card_s4_l.fill.solid()
    card_s4_l.fill.fore_color.rgb = WHITE
    card_s4_l.line.color.rgb = BORDER_BLUE
    card_s4_l.line.width = Pt(1.5)

    tf4_l = card_s4_l.text_frame
    tf4_l.word_wrap = True
    tf4_l.margin_left = Inches(0.3)
    tf4_l.margin_top = Inches(0.25)

    p = tf4_l.paragraphs[0]
    p.text = "Feasibility :-"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(6)

    feas_items = [
        "• Technical: Built on proven open-source AI/ML models, open APIs (OpenStreetMap, UPI), and auto-scaling cloud microservices → Highly scalable.",
        "• Economic: Low-cost open-source tech stack; sustainable via micro-subscription for hotels and 0% commission direct bookings (saving 20-30% OTA cut).",
        "• Operational: Dual light-interface: Zero-training PWA/portal for hoteliers & multi-lingual offline PWA mode for tourists."
    ]
    for item in feas_items:
        p = tf4_l.add_paragraph()
        p.text = item
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(5)

    p = tf4_l.add_paragraph()
    p.text = "Potential Challenges & Mitigations :-"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ORANGE
    p.space_after = Pt(6)

    cm_pairs = [
        ("• Spotty connectivity in remote tourist hubs", "→ Offline-first PWA with local edge caching for tickets & itineraries."),
        ("• Tech hesitation among small homestay hosts", "→ Zero-friction 1-click WhatsApp & simple mobile onboarding."),
        ("• Real-time crowd density accuracy", "→ GPS telemetry combined with historical algorithmic prediction.")
    ]
    for chal, mit in cm_pairs:
        p = tf4_l.add_paragraph()
        r1 = p.add_run()
        r1.text = chal + "\n  "
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = TEXT_DARK

        r2 = p.add_run()
        r2.text = mit
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = GREEN
        p.space_after = Pt(4)

    # Right: Viability, Supporting Facts & Business Potential (6.2 Inches)
    card_s4_r = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.6), Inches(1.35), Inches(6.2), Inches(5.5))
    card_s4_r.fill.solid()
    card_s4_r.fill.fore_color.rgb = WHITE
    card_s4_r.line.color.rgb = BORDER_BLUE
    card_s4_r.line.width = Pt(1.5)

    tf4_r = card_s4_r.text_frame
    tf4_r.word_wrap = True
    tf4_r.margin_left = Inches(0.3)
    tf4_r.margin_top = Inches(0.25)

    p = tf4_r.paragraphs[0]
    p.text = "Viability :-"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(6)

    viab_items = [
        "• Technically Feasible: Uses standard Python, WebGL & PWA APIs without requiring proprietary hardware.",
        "• Economically Sustainable: Highly profitable for SMB hotels by replacing steep 20–30% OTA cuts with direct bookings.",
        "• Socially Impactful: Decentralizes tourism revenue into rural & tribal belts while preventing degradation at fragile sites.",
        "• Scalable & Adaptable: Plug-and-play architecture adaptable for State Tourism Boards, pilgrimage circuits, and heritage hubs."
    ]
    for item in viab_items:
        p = tf4_r.add_paragraph()
        p.text = item
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(4)

    p = tf4_r.add_paragraph()
    p.text = "SUPPORTING FACTS FOR FEASIBILITY & VIABILITY"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(4)

    facts = [
        "• Revenue Boost for Hotels: Hospitality analytics prove independent hotels using automated AI dynamic pricing see an 18%–25% increase in RevPAR and 20% higher off-season occupancy.",
        "• Consumer Shift to Offbeat: UNWTO and Ministry of Tourism surveys indicate over 65% of Gen-Z & Millennial travelers actively seek offbeat local stays over crowded commercial hubs."
    ]
    for fact in facts:
        p = tf4_r.add_paragraph()
        p.text = fact
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_MUTED
        p.space_after = Pt(4)

    p = tf4_r.add_paragraph()
    p.text = "Business Potential: Tiered SaaS for Hotels | Direct Booking Marketplace | B2G Analytics"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ORANGE

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_common_header(s5, "IMPACT AND BENEFITS", 5)

    # 3 Structured Impact Cards
    card5_1 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(1.35), Inches(12.333), Inches(2.0))
    card5_1.fill.solid()
    card5_1.fill.fore_color.rgb = WHITE
    card5_1.line.color.rgb = BLUE
    card5_1.line.width = Pt(1.5)

    tf5_1 = card5_1.text_frame
    tf5_1.word_wrap = True
    tf5_1.margin_left = Inches(0.35)
    tf5_1.margin_top = Inches(0.2)

    p = tf5_1.paragraphs[0]
    p.text = "Potential impact on the target audience :-"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(6)

    aud_impacts = [
        ("• Improves Tourist Experience: ", "Makes travel personalized, convenient, budget-friendly, and protected with offline emergency SOS."),
        ("• Boosts Local Economy: ", "Increases visibility, direct bookings, and income for small homestays, rural hosts, and artisan guides."),
        ("• Promotes Sustainable Tourism: ", "Reduces overcrowding via heatmaps and encourages exploration of lesser-known offbeat destinations."),
        ("• Improves Decision-Making: ", "Provides actionable crowd and occupancy analytics for state tourism boards and business owners.")
    ]
    for label, desc in aud_impacts:
        p = tf5_1.add_paragraph()
        r1 = p.add_run()
        r1.text = label
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_DARK
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_DARK
        p.space_after = Pt(2.5)

    # Benefits Card
    card5_2 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(3.5), Inches(12.333), Inches(2.0))
    card5_2.fill.solid()
    card5_2.fill.fore_color.rgb = WHITE
    card5_2.line.color.rgb = GREEN
    card5_2.line.width = Pt(1.5)

    tf5_2 = card5_2.text_frame
    tf5_2.word_wrap = True
    tf5_2.margin_left = Inches(0.35)
    tf5_2.margin_top = Inches(0.2)

    p = tf5_2.paragraphs[0]
    p.text = "Benefits of the Solution :-"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(6)

    sol_benefits = [
        "• One-Stop Platform: Unifies itinerary planning, direct booking, multi-currency budgeting, and transit maps into a single PWA.",
        "• AI-Powered Recommendations: Context-aware recommendations tailored to traveler budget, duration, and personal interests.",
        "• Smart Budgeting: Live mathematical currency converter and expense categorization to eliminate hidden travel costs.",
        "• Trusted & Safe Services: Verified host listings, contactless QR ticketing, and hardware emergency sound synthesizer.",
        "• Promotes Local Tourism: Connects eco-tourists with indigenous homestays and authentic regional heritage."
    ]
    for b in sol_benefits:
        p = tf5_2.add_paragraph()
        p.text = b
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_DARK
        p.space_after = Pt(2.5)

    # Unique Outcomes Quote Box
    card5_3 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(5.65), Inches(12.333), Inches(1.2))
    card5_3.fill.solid()
    card5_3.fill.fore_color.rgb = NAVY
    card5_3.line.color.rgb = ORANGE
    card5_3.line.width = Pt(1.5)

    tf5_3 = card5_3.text_frame
    tf5_3.word_wrap = True
    tf5_3.margin_left = Inches(0.4)
    tf5_3.margin_top = Inches(0.18)

    p = tf5_3.paragraphs[0]
    p.text = "Unique Outcomes from Our Solution"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ORANGE
    p.space_after = Pt(4)

    p = tf5_3.add_paragraph()
    p.text = '“SmartTour Connect transforms fragmented tourism services into one intelligent ecosystem — making travel personalized, affordable, safe, sustainable, and beneficial for both tourists and local businesses.”'
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = WHITE

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_common_header(s6, "RESEARCH AND REFERENCES", 6)

    # Left: Research Papers & References (5.5 Inches)
    card6_l = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(1.35), Inches(5.5), Inches(4.3))
    card6_l.fill.solid()
    card6_l.fill.fore_color.rgb = WHITE
    card6_l.line.color.rgb = BORDER_BLUE
    card6_l.line.width = Pt(1.5)

    tf6_l = card6_l.text_frame
    tf6_l.word_wrap = True
    tf6_l.margin_left = Inches(0.3)
    tf6_l.margin_top = Inches(0.2)

    p = tf6_l.paragraphs[0]
    p.text = "• Research Papers & Citations:"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(4)

    papers = [
        ("1. A Survey on Personalized Itinerary Recommendation", "Applied Soft Computing, 2024 | doi.org/10.1016/j.asoc.2023.111200"),
        ("2. How Smart is E-Tourism? Recommendation Systems", "Computer Science Review, 2021 | doi.org/10.1016/j.cosrev.2020.100337"),
        ("3. Artificial Intelligence in Tourism Research Agenda", "Sustainability, 2025 | doi.org/10.3390/su17209080"),
        ("4. Context-Aware Tourism using RAG & Semantic Re-Rank", "Electronics, 2025 | doi.org/10.3390/electronics14224448")
    ]
    for title, cite in papers:
        p = tf6_l.add_paragraph()
        r1 = p.add_run()
        r1.text = title + "\n"
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = TEXT_DARK

        r2 = p.add_run()
        r2.text = cite
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = BLUE
        p.space_after = Pt(3)

    p = tf6_l.add_paragraph()
    p.text = "• Policy & Government References:"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(3)

    govs = [
        "• ONDC Travel & Mobility Protocols (Open discovery network)",
        "• Ministry of Tourism — India Tourism Statistics & Reports",
        "• NITI Aayog — Rethinking Homestays & Rural Tourism Policy"
    ]
    for g in govs:
        p = tf6_l.add_paragraph()
        p.text = g
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_MUTED
        p.space_after = Pt(2)

    # Right: Platform Feature Comparison Matrix (6.6 Inches)
    card6_r = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.2), Inches(1.35), Inches(6.6), Inches(4.3))
    card6_r.fill.solid()
    card6_r.fill.fore_color.rgb = WHITE
    card6_r.line.color.rgb = BORDER_BLUE
    card6_r.line.width = Pt(1.5)

    tf6_r = card6_r.text_frame
    tf6_r.word_wrap = True
    tf6_r.margin_left = Inches(0.25)
    tf6_r.margin_top = Inches(0.2)

    p = tf6_r.paragraphs[0]
    p.text = "Platform Feature Comparison Matrix"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.space_after = Pt(6)

    table_data = [
        ("Feature / Capability", "SmartTour", "MakeMyTrip", "ixigo", "Wanderlog"),
        ("1. AI-Driven Dynamic Itinerary", "✓ (Full)", "✓ (Basic)", "✓ (Basic)", "✓"),
        ("2. 0% OTA Host Commission", "✓ (Direct)", "✗ (20-30%)", "✗ (15-25%)", "✗"),
        ("3. Local Homestay & Guide Hub", "✓ (Verified)", "✓ (Commercial)", "✓", "✗"),
        ("4. Real-Time Crowd Density Map", "✓ (Live)", "✗", "✗", "✓ (Limited)"),
        ("5. Hardware Emergency SOS Siren", "✓ (Offline)", "✗", "✗", "✗"),
        ("6. Triple-Sync Multi-Format DB", "✓ (JSON/CSV)", "✗", "✗", "✗"),
        ("7. Contactless QR Eco-Pass Pass", "✓ (Instant)", "✓", "✓", "✗")
    ]

    for row_idx, (f, st, mmt, ixg, wnd) in enumerate(table_data):
        p = tf6_r.add_paragraph()
        is_hdr = (row_idx == 0)
        
        r1 = p.add_run()
        r1.text = f"{f:<30} | {st:<10} | {mmt:<12} | {ixg:<8} | {wnd}"
        r1.font.bold = is_hdr or ("✓" in st)
        r1.font.size = Pt(9.5 if not is_hdr else 10)
        r1.font.color.rgb = NAVY if is_hdr else (BLUE if row_idx % 2 == 0 else TEXT_DARK)
        p.space_after = Pt(3)

    # Bottom Flow & Project Links Bar (Slide 6)
    card6_btm = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(5.75), Inches(12.333), Inches(1.2))
    card6_btm.fill.solid()
    card6_btm.fill.fore_color.rgb = WHITE
    card6_btm.line.color.rgb = BORDER_BLUE
    card6_btm.line.width = Pt(1.5)

    tf6_b = card6_btm.text_frame
    tf6_b.word_wrap = True
    tf6_b.margin_left = Inches(0.35)
    tf6_b.margin_top = Inches(0.15)

    p = tf6_b.paragraphs[0]
    p.text = "• Research Flow: Problem ID → Literature Review → Gap Analysis → Tech Exploration → Validation → Proposed Solution → SmartTour Ecosystem"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(4)

    p = tf6_b.add_paragraph()
    r = p.add_run()
    r.text = "• Project Demo Links:  "
    r.font.bold = True
    r.font.size = Pt(10)
    r.font.color.rgb = ORANGE

    r2 = p.add_run()
    r2.text = "Web Portal: http://localhost:8000 | Admin Console: http://localhost:8000/admin.html | Presentation Visualizer: http://localhost:8000/sih_presentation.html"
    r2.font.size = Pt(10)
    r2.font.color.rgb = BLUE

    # Save to both target directories
    out1 = os.path.join(os.path.dirname(__file__), "Rawauthentic_SIH2026_SmartTourConnect.pptx")
    prs.save(out1)
    print(f"[SUCCESS] SIH 2026 PPT generated successfully at: {out1}")

    # Copy to smart-tour-connect root as well
    target_dir = r"C:\Users\Sahil\.gemini\antigravity\scratch\smart-tour-connect"
    if os.path.exists(target_dir):
        out2 = os.path.join(target_dir, "Rawauthentic_SIH2026_SmartTourConnect.pptx")
        prs.save(out2)
        print(f"[SUCCESS] SIH 2026 PPT copied to: {out2}")

if __name__ == "__main__":
    create_sih_official_deck()
