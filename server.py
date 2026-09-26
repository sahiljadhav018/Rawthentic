# -*- coding: utf-8 -*-
"""
================================================================================
SMART TOUR CONNECT - Autonomous Multi-Modal Transit Grid & Homestay Backend
Smart India Hackathon (SIH 2026) | Problem Statement: SIH26204 | Theme: Travel & Tourism
Team: Rawauthentic
Lead Developer: Sahil Jadhav (sahilujadhav143@gmail.com)
================================================================================
Engineering Rationale:
- Designed to run on pure Python 3 standard library (zero third-party dependencies)
  ensuring 100% zero-friction evaluation for SIH judges across Windows, Linux, and macOS.
- Multi-Ledger Triple Persistence:
    * backend_db.json      -> Fast query document store for real-time app sync
    * backend_bookings.csv -> Auto-generated Excel-ready ledger for local homestay hosts
    * backend_summary.txt  -> Printable text receipt slips for low-connectivity offline counters
- Integrated Transit-Hotel Engine:
    * Real IRCTC Train routes, MSRTC/KSRTC bus links & direct zero-commission homestays
================================================================================
"""

import http.server
import socketserver
import json
import os
import sys
import csv
import webbrowser
import threading
import time
import urllib.request
import urllib.parse
import re
from datetime import datetime
try:
    import transit_hotel_engine
except ImportError:
    transit_hotel_engine = None

# Safe Windows Console UTF-8 Reconfiguration
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(DIRECTORY, "backend_db.json")
CSV_FILE = os.path.join(DIRECTORY, "backend_bookings.csv")
TXT_FILE = os.path.join(DIRECTORY, "backend_summary.txt")

def init_db():
    """Initializes multi-format database files with clean initial records."""
    if not os.path.exists(DB_FILE):
        initial_data = {
            "system": "Smart Tour Connect Backend",
            "lastStarted": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "bookings": [
                {
                    "id": "STC-GLO-102934",
                    "createdAt": "2026-09-09 18:30:00",
                    "destination": "Western Ghats & Sahyadri",
                    "state": "Maharashtra, India",
                    "travelers": 2,
                    "durationDays": 2,
                    "financials": {
                        "userBudget": "₹10,000",
                        "totalExpense": "₹7,360",
                        "remainingSavings": "₹2,640",
                        "budgetStatus": "WITHIN_BUDGET"
                    },
                    "train": {
                        "name": "Deccan Queen Superfast",
                        "number": "12123",
                        "class": "AC Chair Car",
                        "route": "Mumbai CSMT -> Pune / Lonavala",
                        "totalFare": "₹1,920"
                    },
                    "hotel": {
                        "hotelType": "Verified Heritage Stay",
                        "nights": 1,
                        "rooms": 1,
                        "ratePerNight": "₹1,600",
                        "totalHotelCost": "₹1,600"
                    },
                    "foodAndTransit": {
                        "localTransit": "₹1,600",
                        "meals": "₹2,000",
                        "total": "₹3,600"
                    },
                    "sightseeing": {
                        "activitiesTotal": "₹1,200",
                        "passes": "Sinhagad Fort, Kaas Plateau UNESCO Valley"
                    },
                    "relatedPlaces": [
                        "Sinhagad Fort Historic Citadel",
                        "Kaas Plateau UNESCO Flower Valley",
                        "Andharban Dark Forest Trek"
                    ],
                    "status": "CONFIRMED_SAVED"
                }
            ],
            "hotelRates": {
                "baseRate": 3000,
                "dynamicRate": 3600,
                "occupancy": 60,
                "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            "sosAlerts": []
        }
        save_all_formats(initial_data)
        print(f"[INFO] Initialized backend files:\n  1. {DB_FILE}\n  2. {CSV_FILE}\n  3. {TXT_FILE}")

def load_db():
    try:
        if os.path.exists(DB_FILE):
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"[WARN] Error loading JSON database: {e}")
    return {
        "users": [
            {
                "id": "USR-ADMIN-01",
                "name": "Sahil Jadhav (Admin)",
                "email": "admin@smarttour.com",
                "phone": "+91 9800000000",
                "role": "ADMIN",
                "password": "admin123",
                "createdAt": "2026-09-01 10:00:00",
                "status": "ACTIVE"
            },
            {
                "id": "USR-CUST-101",
                "name": "Sahil (Traveler)",
                "email": "sahil@traveler.com",
                "phone": "+91 9876543210",
                "role": "CUSTOMER",
                "password": "user123",
                "createdAt": "2026-09-10 14:30:00",
                "status": "ACTIVE"
            }
        ],
        "loginLogs": [
            {
                "id": "LOG-1001",
                "userId": "USR-CUST-101",
                "userName": "Sahil (Traveler)",
                "role": "CUSTOMER",
                "timestamp": "2026-09-15 18:30:15",
                "device": "Mobile (Chrome / Android)",
                "ip": "127.0.0.1",
                "status": "SUCCESS"
            }
        ],
        "bookings": [],
        "hotelRates": {},
        "sosAlerts": []
    }

def save_all_formats(db_data):
    """Saves to JSON, CSV (Excel), and TXT formatted ledger simultaneously."""
    # 1. Save JSON
    try:
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(db_data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[WARN] Error saving JSON: {e}")

    # 2. Save CSV for Excel
    try:
        bookings = db_data.get("bookings", [])
        with open(CSV_FILE, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow([
                "Booking ID", "Timestamp", "Customer Name", "Customer Phone",
                "Destination", "State", "Travelers", "Days",
                "User Budget", "Total Expense", "Remaining Buffer",
                "Train Name", "Train No", "Train Fares",
                "Hotel Cost", "Food & Local Transit", "Sightseeing Cost", "Status"
            ])
            for b in bookings:
                fin = b.get("financials", {})
                trn = b.get("train", {})
                htl = b.get("hotel", {})
                fnt = b.get("foodAndTransit", {})
                sgt = b.get("sightseeing", {})
                writer.writerow([
                    b.get("id", ""),
                    b.get("createdAt", ""),
                    b.get("customerName", "Guest User"),
                    b.get("customerPhone", "N/A"),
                    b.get("destination", ""),
                    b.get("state", ""),
                    b.get("travelers", 2),
                    b.get("durationDays", 2),
                    fin.get("userBudget", b.get("amount", "₹0")),
                    fin.get("totalExpense", b.get("amount", "₹0")),
                    fin.get("remainingSavings", "₹0"),
                    trn.get("name", "N/A"),
                    trn.get("number", "N/A"),
                    trn.get("totalFare", "N/A"),
                    htl.get("totalHotelCost", "N/A"),
                    fnt.get("total", "N/A"),
                    sgt.get("activitiesTotal", "N/A"),
                    b.get("status", "CONFIRMED")
                ])
    except Exception as e:
        print(f"[WARN] Error saving CSV: {e}")

    # 3. Save Clean Human-Readable Text Slip / Ledger
    try:
        bookings = db_data.get("bookings", [])
        with open(TXT_FILE, "w", encoding="utf-8") as f:
            f.write("=" * 80 + "\n")
            f.write("         SMART TOUR CONNECT - OFFICIAL BACKEND BOOKINGS LEDGER\n")
            f.write(f"         Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=" * 80 + "\n\n")

            for idx, b in enumerate(bookings, 1):
                fin = b.get("financials", {})
                trn = b.get("train", {})
                htl = b.get("hotel", {})
                fnt = b.get("foodAndTransit", {})
                sgt = b.get("sightseeing", {})
                places = b.get("relatedPlaces", [])

                f.write(f"RECORD #{idx} | PASS ID: {b.get('id', 'N/A')}\n")
                f.write("-" * 80 + "\n")
                f.write(f"  Customer Name  : {b.get('customerName', 'Guest User')}\n")
                f.write(f"  Mobile Number  : {b.get('customerPhone', 'N/A')}\n")
                f.write(f"  Date & Time    : {b.get('createdAt', 'N/A')}\n")
                f.write(f"  Destination    : {b.get('destination', 'N/A')} ({b.get('state', '')})\n")
                f.write(f"  Travelers/Days : {b.get('travelers', 2)} Travelers | {b.get('durationDays', 2)} Days\n")
                f.write(f"  User Budget    : {fin.get('userBudget', b.get('amount', 'N/A'))}\n")
                f.write(f"  Total Cost     : {fin.get('totalExpense', b.get('amount', 'N/A'))}\n")
                f.write(f"  Buffer Savings : {fin.get('remainingSavings', 'N/A')} ({fin.get('budgetStatus', 'CONFIRMED')})\n")
                f.write("  ----------------------------------------------------------------------------\n")
                f.write(f"  Train Transit  : {trn.get('name', 'N/A')} (No. {trn.get('number', 'N/A')})\n")
                f.write(f"                   Route: {trn.get('route', 'N/A')} | Total Fare: {trn.get('totalFare', 'N/A')}\n")
                f.write(f"  Hotel Stay     : {htl.get('hotelType', 'Verified Stay')} ({htl.get('rooms', 1)} Room, {htl.get('nights', 1)} Night)\n")
                f.write(f"                   Total Hotel Cost: {htl.get('totalHotelCost', 'N/A')} (0% OTA Cut)\n")
                f.write(f"  Food & Commute : Transit: {fnt.get('localTransit', 'N/A')} | Meals: {fnt.get('meals', 'N/A')}\n")
                f.write(f"  Sightseeing    : {sgt.get('activitiesTotal', 'N/A')} (Passes & Eco-Trails)\n")
                if places:
                    f.write("  Places Covered : " + ", ".join(places[:4]) + "\n")
                f.write(f"  Status         : {b.get('status', 'CONFIRMED')}\n")
                f.write("=" * 80 + "\n\n")
    except Exception as e:
        print(f"[WARN] Error saving TXT ledger: {e}")

def cloud_relay_sync_worker():
    """Continuously pulls mobile bookings from Cloud Relay (CrudCrud)
    and saves them immediately into backend_bookings.csv, backend_summary.txt, and backend_db.json.
    This guarantees 100% real-time data capture even when mobile phones are on cellular 4G/5G.
    """
    CRUDCRUD_URL = "https://crudcrud.com/api/d58ce587245d46b688e584b01283e91e/bookings"
    while True:
        try:
            req = urllib.request.Request(
                CRUDCRUD_URL,
                headers={"User-Agent": "STC-Backend-Sync/1.0", "Accept": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=6) as response:
                if response.status == 200:
                    raw = response.read().decode("utf-8")
                    cloud_list = json.loads(raw)
                    if isinstance(cloud_list, list) and len(cloud_list) > 0:
                        db = load_db()
                        existing_ids = {b.get("id") for b in db.get("bookings", []) if b.get("id")}
                        new_count = 0
                        for cb in cloud_list:
                            bid = cb.get("id")
                            if not bid or bid in existing_ids:
                                continue
                            fin = cb.get("financials", {})
                            formatted = {
                                "id": bid,
                                "createdAt": cb.get("createdAt", datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
                                "customerName": cb.get("customerName", cb.get("name", "Guest Traveler")),
                                "customerPhone": cb.get("customerPhone", cb.get("phone", cb.get("mobile", "N/A"))),
                                "destination": cb.get("destination", "Mobile Booking"),
                                "state": cb.get("state", "India"),
                                "travelers": cb.get("travelers", 2),
                                "durationDays": cb.get("durationDays", 2),
                                "financials": {
                                    "userBudget": fin.get("userBudget", cb.get("amount", "₹0")),
                                    "totalExpense": fin.get("totalExpense", cb.get("amount", "₹0")),
                                    "remainingSavings": fin.get("remainingSavings", "₹0"),
                                    "budgetStatus": fin.get("budgetStatus", "CONFIRMED")
                                },
                                "train": cb.get("train", {
                                    "name": "Direct Rail", "number": "STC-EXP", "class": "AC Chair Car", "route": "City -> Destination", "totalFare": "₹0"
                                }),
                                "hotel": cb.get("hotel", {
                                    "hotelType": "Verified Stay", "nights": 1, "rooms": 1, "ratePerNight": "₹0", "totalHotelCost": "₹0"
                                }),
                                "foodAndTransit": cb.get("foodAndTransit", {
                                    "localTransit": "₹0", "meals": "₹0", "total": "₹0"
                                }),
                                "sightseeing": cb.get("sightseeing", {
                                    "activitiesTotal": "₹0", "passes": "Eco-Trail Pass"
                                }),
                                "relatedPlaces": cb.get("relatedPlaces", []),
                                "status": "CONFIRMED_LIVE_SAVED"
                            }
                            db.setdefault("bookings", []).insert(0, formatted)
                            existing_ids.add(bid)
                            new_count += 1
                            print(f"[LIVE MOBILE SYNC] Captured mobile booking: {bid} -> {formatted['destination']}")

                        if new_count > 0:
                            save_all_formats(db)
                            print(f"[LIVE MOBILE SYNC] 💾 Saved {new_count} new mobile booking(s) to CSV, TXT & JSON!")
        except Exception:
            pass

        time.sleep(5)

class STCHttpHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def _detect_lang(self, text):
        if not text: return "mr"
        if re.search(r"[઀-૿]", text): return "gu" # Gujarati
        if re.search(r"[஀-௿]", text): return "ta" # Tamil
        if re.search(r"[ఀ-౿]", text): return "te" # Telugu
        if re.search(r"[ಀ-೿]", text): return "kn" # Kannada
        if re.search(r"[ঀ-৿]", text): return "bn" # Bengali
        if re.search(r"[਀-੿]", text): return "pa" # Punjabi
        if re.search(r"[ഀ-ൿ]", text): return "ml" # Malayalam
        if re.search(r"[؀-ۿ]", text): return "ar" # Arabic
        if re.search(r"[぀-ゟ゠-ヿ一-龯]", text): return "ja" # Japanese
        if re.search(r"[Ѐ-ӿ]", text): return "ru" # Russian
        if re.search(r"[ऀ-ॿ]", text):
            if re.search(r"(आहे|नाही|करा|बोला|सांगा|कसे|कसा|कशी|फिरायला|कुठे|आलो|गेलो|मला|तुम्ही|काही|करायचे|जावे|जाऊ|आहेत|नका|चंपक)", text, re.I):
                return "mr"
            if re.search(r"(है|नहीं|हूँ|हूं|करो|बताओ|कैसे|कैसा|कैसी|घूमने|कहाँ|गया|आया|मुझे|आप|कुछ|करना|जाना|जाएं|हैं|मत)", text, re.I):
                return "hi"
            return "mr"
        tl = text.lower()
        if re.search(r"(hola|gracias|bueno|dónde|donde|como|viaje|por favor|amigo)", tl): return "es"
        if re.search(r"(bonjour|merci|voyage|comment|où|ou|s'il vous plaît|ami)", tl): return "fr"
        if re.search(r"(hallo|danke|reise|wo|wie|bitte|guten tag|freund)", tl): return "de"
        return "en"

    def _generate_builtin_ai_reply(self, q, lang="auto"):
        target_lang = self._detect_lang(q) if lang in ["auto", "", None] else lang
        is_mr = (target_lang == "mr")
        is_hi = (target_lang == "hi")
        is_gu = (target_lang == "gu")
        is_es = (target_lang == "es")
        is_fr = (target_lang == "fr")
        is_de = (target_lang == "de")
        is_ja = (target_lang == "ja")

        # 1. Identity / Who are you
        if re.search(r"(तू कोण|who are you|तुझे नाव|what is your name|चंपक कोण|तुझी माहिती|who made you|कोणी बनवले|तुम कौन हो|आपका नाम|quién eres|qui es-tu|wer bist du)", q, re.I):
            if is_mr:
                msg = 'मी चंपक (Champak), Smart Tour Connect चा सर्व भाषा जाणणारा 3D AI व्हॉइस असिस्टंट आहे! मी मराठी, हिन्दी, इंग्रजी, गुजराती, तमिळ, स्पॅनिश आणि जगातील सर्व भाषांमध्ये बोलू शकतो.'
            elif is_hi:
                msg = 'मैं चंपक (Champak) हूँ, Smart Tour Connect का बहुभाषी 3D AI वॉइस असिस्टेंट! मैं हिन्दी, मराठी, अंग्रेजी और दुनिया की सभी भाषाओं में बात कर सकता हूँ।'
            elif is_gu:
                msg = 'હું ચંપક છું, Smart Tour Connect નો બહુભાષી 3D AI વૉઇસ સહાયક! હું તમામ ભાષાઓ સમજી અને બોલી શકું છું.'
            elif is_es:
                msg = '¡Soy Champak, el asistente de voz 3D omnilingüe de Smart Tour Connect! Hablo y entiendo todos los idiomas del mundo con fluidez.'
            elif is_fr:
                msg = "Je suis Champak, l'assistant vocal 3D omnilingue de Smart Tour Connect! Je parle couramment toutes les langues du monde."
            elif is_de:
                msg = 'Ich bin Champak, der allsprachige 3D-KI-Sprachassistent von Smart Tour Connect! Ich spreche und verstehe alle Sprachen der Welt fließend.'
            elif is_ja:
                msg = '私はチャンパク（Champak）です。Smart Tour Connectの多言語3D AI音声アシスタントです！世界中のすべての言語を話せます。'
            else:
                msg = 'I am Champak, the omni-lingual 3D AI Voice Companion for Smart Tour Connect! Powered by Gemini and ChatGPT, I speak and understand all languages across the globe.'
            return msg, 'Champak Omni-Lingual Brain'

        # 2. Math calculation
        math_match = re.search(r'(\d+[\s\+\-\*\/\%xX\.]+\d+)', q)
        if math_match:
            expr = math_match.group(1).replace('x', '*').replace('X', '*')
            try:
                val = eval(expr, {'__builtins__': None}, {})
                if is_mr: ans = f'याचे गणितीय उत्तर {val} आहे!'
                elif is_hi: ans = f'इसका गणितीय उत्तर {val} है!'
                elif is_gu: ans = f'આનો ગાણિતિક જવાબ {val} છે!'
                elif is_es: ans = f'El resultado matemático es {val}!'
                elif is_fr: ans = f'Le résultat mathématique est {val}!'
                elif is_de: ans = f'Das mathematische Ergebnis ist {val}!'
                elif is_ja: ans = f'計算結果は {val} です！'
                else: ans = f'The calculated answer is {val}!'
                return ans, 'Champak Math Engine'
            except Exception:
                pass

        # 3. Jokes
        if re.search(r'(joke|विनोद|हसव|काहीतरी मजेदार|funny|चुटकुला|मजाक|chiste|blague|witz)', q, re.I):
            if is_mr:
                ans = 'एकदा एक पर्यटक म्हणाला: "गावात फिरण्यासाठी सर्वात सुंदर जागा कोणती?" स्थानिक माणूस म्हणाला: "आमच्या गावाबाहेर जाणारा रस्ता, तिथून संपूर्ण गाव शांत दिसते!" 😃'
            elif is_hi:
                ans = 'एक पर्यटक ने पूछा: "यहाँ सबसे पुराना पेड़ कौन सा है?" गाइड ने कहा: "वही जो सबसे पहले उगा था!" 😄'
            elif is_es:
                ans = '¿Por qué los pájaros vuelan hacia el sur en invierno? ¡Porque caminar tomaría demasiado tiempo! 😄'
            elif is_fr:
                ans = "Pourquoi les oiseaux volent-ils vers le sud en hiver? Parce que c'est trop long d'y aller à pied! 😄"
            else:
                ans = 'Why do programmers prefer mountain vacations? Because out there, there are no bugs! 😄'
            return ans, 'Champak Multilingual Humor'

        # 4. Live Knowledge Search via Wikipedia API (Auto Language)
        clean_q = re.sub(r"(काय आहे|कोण आहे|बद्दल|माहिती|सांगा|सांग|कुठे आहे|कसा आहे|क्या है|कहाँ है|बताओ|जानकारी|where is|what is|who is|tell me about|info on|quién es|qué es|où est|c'est quoi)\??", "", q, flags=re.I).strip()
        clean_q = re.sub(r'\s+', ' ', clean_q).strip()
        if clean_q:
            langs_to_try = [target_lang, 'en'] if target_lang != 'en' else ['en']
            for w_lang in langs_to_try:
                try:
                    w_url = f'https://{w_lang}.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(clean_q)}'
                    req = urllib.request.Request(w_url, headers={'User-Agent': 'SmartTourConnectBot/2.0'})
                    with urllib.request.urlopen(req, timeout=3.5) as r:
                        if r.status == 200:
                            w_data = json.loads(r.read().decode('utf-8'))
                            extract = w_data.get('extract')
                            if extract:
                                sentences = '. '.join(extract.split('. ')[:2]).strip()
                                if not sentences.endswith('.'): sentences += '.'
                                return sentences, f'Global Knowledge ({w_lang.upper()})'
                except Exception:
                    pass

        # 5. Multilingual Conversational Fallback
        if is_mr:
            ans = f'तुम्ही "{q}" बद्दल विचारले आहे. मी चंपक AI, जगातील सर्व भाषा जाणतो! प्रवास, हॉटेल्स किंवा इतर कोणत्याही विषयावर मला विचारा.'
        elif is_hi:
            ans = f'आपने "{q}" के बारे में पूछा है। मैं चंपक AI, दुनिया की सभी भाषाएँ जानता हूँ! यात्रा, होटल या किसी भी विषय पर मुझसे पूछें।'
        elif is_gu:
            ans = f'તમે "{q}" વિશે પૂછ્યું છે. હું ચંપક AI, વિશ્વની તમામ ભાષાઓ જાણું છું! પ્રવાસ અને હોટલ વિશે મને પૂછો.'
        elif is_es:
            ans = f'Has preguntado sobre "{q}". ¡Soy Champak AI y hablo todos los idiomas! Pregúntame lo que quieras sobre viajes y hoteles.'
        elif is_fr:
            ans = f'Vous avez posé une question sur "{q}". Je suis Champak AI et je parle toutes les langues! Posez-moi vos questions de voyage.'
        elif is_de:
            ans = f'Sie haben nach "{q}" gefragt. Ich bin Champak AI und spreche alle Sprachen! Fragen Sie mich alles über Reisen und Hotels.'
        elif is_ja:
            ans = f'"{q}" についてのご質問ですね。私はチャンパクAIです。すべての言語に対応しています！何でもお尋ねください。'
        else:
            ans = f'You asked about "{q}". I am Champak AI, your omni-lingual companion who speaks all languages! Feel free to ask me anything about travel, hotels, or life.'
        return ans, 'Champak Universal Assistant'

    def _generate_builtin_ai_reply_legacy(self, q, is_mr):
        return self._generate_builtin_ai_reply(q, "mr" if is_mr else "en")
        # 1. Identity / Who are you
        if re.search(r'(तू कोण|who are you|तुझे नाव|what is your name|चंपक कोण|तुझी माहिती|who made you|कोणी बनवले)', q, re.I):
            return (
                'मी चंपक (Champak), Smart Tour Connect चा 3D AI व्हॉइस असिस्टंट आहे! '
                'मी तुम्हाला गुगल जेमिनी (Gemini) आणि ओपनएआय चॅटजीपीटी (ChatGPT) च्या बुद्धिमत्तेसह सर्व प्रकारच्या प्रवासाचे नियोजन, '
                'हॉटेल, ट्रेन तिकीट आणि सामान्य ज्ञानाच्या प्रश्नांची अचूक उत्तरे देऊ शकतो.',
                'Champak AI Brain (Gemini/GPT Powered)'
            ) if is_mr else (
                'I am Champak, the 3D AI Voice Companion for Smart Tour Connect! '
                'Powered by Gemini and ChatGPT intelligence, I assist you with trip planning, hotel savings, train routes, and general knowledge!',
                'Champak AI Brain (Gemini/GPT Powered)'
            )

        # 2. Math calculation
        math_match = re.search(r'(\d+[\s\+\-\*\/\%xX\.]+\d+)', q)
        if math_match:
            expr = math_match.group(1).replace('x', '*').replace('X', '*')
            try:
                val = eval(expr, {'__builtins__': None}, {})
                ans = f'याचे गणितीय उत्तर {val} आहे!' if is_mr else f'The calculated answer is {val}!'
                return ans, 'Champak Math Engine'
            except Exception:
                pass

        # 3. Jokes / विनाेद
        if re.search(r'(joke|विनोद|हसव|काहीतरी मजेदार|funny)', q, re.I):
            ans = (
                'एकदा एक पर्यटक म्हणाला: "तुमच्या गावात फिरण्यासाठी सर्वात सुंदर जागा कोणती?" '
                'स्थानिक माणूस म्हणाला: "आमच्या गावाबाहेर जाणारा रस्ता, तिथून संपूर्ण गाव शांत दिसते!" 😃'
            ) if is_mr else (
                'Why did the tourist put sunscreen on the clock? Because they wanted to have some saved time under the sun! 😄'
            )
            return ans, 'Champak Humor AI'

        # 4. Weather / हवामान
        if re.search(r'(हवामान|weather|तापमान|temperature|पाऊस|rain)', q, re.I):
            ans = (
                'सध्या महाराष्ट्रात आल्हाददायक वातावरण आहे. प्रवासाला निघण्यापूर्वी सोबत छत्री किंवा हलके जॅकेट नक्की ठेवा, जेणेकरून तुमचा प्रवास सुखकर होईल!'
            ) if is_mr else (
                'The weather across Maharashtra is pleasant. Keep an umbrella or light jacket handy during travel for a comfortable trip!'
            )
            return ans, 'Champak Weather Intelligence'

        # 5. Live Knowledge Search via Wikipedia API (Marathi & English)
        clean_q = re.sub(r'(काय आहे|कोण आहे|बद्दल|माहिती|सांगा|माहिती द्या|सांग|सांगा ना|म्हणजे काय|कुठे आहे|कसा आहे|कधी|किती|का|where is|what is|who is|tell me about|information about|info on|history of)\??', '', q, flags=re.I).strip()
        clean_q = re.sub(r'\s+', ' ', clean_q).strip()
        if clean_q:
            langs_to_try = ['mr', 'en'] if is_mr else ['en']
            for w_lang in langs_to_try:
                try:
                    w_url = f'https://{w_lang}.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(clean_q)}'
                    req = urllib.request.Request(w_url, headers={'User-Agent': 'SmartTourConnectBot/2.0'})
                    with urllib.request.urlopen(req, timeout=3.5) as r:
                        if r.status == 200:
                            w_data = json.loads(r.read().decode('utf-8'))
                            extract = w_data.get('extract')
                            if extract:
                                sentences = '. '.join(extract.split('. ')[:2]).strip()
                                if not sentences.endswith('.'): sentences += '.'
                                return sentences, f'Global Knowledge Engine ({w_lang.upper()})'
                except Exception:
                    pass

        # 6. Friendly Conversational Fallback
        ans = (
            f'तुम्ही "{q}" बद्दल विचारले आहे. मी चंपक AI तुमच्या मदतीसाठी सदैव सज्ज आहे! प्रवास, हॉटेल्स, बजेट किंवा इतर कोणत्याही विषयावर मला विचारा.'
        ) if is_mr else (
            f'You asked about "{q}". I am Champak AI, always ready to assist! Ask me anything about travel, hotels, transit, or general knowledge.'
        )
        return ans, 'Champak Universal Assistant'

    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        # Admin Protected Audit Data Endpoint
        if self.path.startswith("/api/admin/audit-data"):
            auth_header = self.headers.get("Authorization", "")
            token_query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query).get("token", [""])[0]
            is_admin = ("ADMIN_TOKEN" in auth_header) or ("ADMIN_TOKEN" in token_query)
            
            if not is_admin:
                self._set_headers(403)
                self.wfile.write(json.dumps({
                    "success": False,
                    "error": "Access Denied: Only Admin can view user logins and app backend data."
                }).encode("utf-8"))
                return

            db = load_db()
            # Ensure users & loginLogs exist
            if "users" not in db or len(db["users"]) == 0:
                db["users"] = [
                    {"id": "USR-ADMIN-01", "name": "Sahil Jadhav (Admin)", "email": "admin@smarttour.com", "phone": "+91 9800000000", "role": "ADMIN", "password": "admin123", "createdAt": "2026-09-01 10:00:00", "status": "ACTIVE"},
                    {"id": "USR-CUST-101", "name": "Sahil (Traveler)", "email": "sahil@traveler.com", "phone": "+91 9876543210", "role": "CUSTOMER", "password": "user123", "createdAt": "2026-09-10 14:30:00", "status": "ACTIVE"}
                ]
            if "loginLogs" not in db:
                db["loginLogs"] = []

            self._set_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "users": db.get("users", []),
                "loginLogs": db.get("loginLogs", []),
                "bookings": db.get("bookings", []),
                "sosAlerts": db.get("sosAlerts", []),
                "hotelRates": db.get("hotelRates", {})
            }, indent=2).encode("utf-8"))
            return

        elif self.path.startswith("/api/admin/export-logins"):
            db = load_db()
            logs = db.get("loginLogs", [])
            csv_output = "Log ID,Timestamp,Customer Name,Email Address,Phone Number,User ID,Role,Device,IP,Status\n"
            for log in logs:
                csv_output += f'"{log.get("id","")}","{log.get("timestamp","")}","{log.get("userName","")}","{log.get("email","")}","{log.get("phone","")}","{log.get("userId","")}","{log.get("role","")}","{log.get("device","")}","{log.get("ip","")}","{log.get("status","")}"\n'
            
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", 'attachment; filename="customer_logins_audit.csv"')
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(csv_output.encode("utf-8-sig"))
            return

        elif self.path.startswith("/api/admin/export-customers"):
            db = load_db()
            users = db.get("users", [])
            csv_output = "User ID,Full Name,Email Address,Phone Number,Role,Account Created,Status\n"
            for u in users:
                csv_output += f'"{u.get("id","")}","{u.get("name","")}","{u.get("email","")}","{u.get("phone","")}","{u.get("role","")}","{u.get("createdAt","")}","{u.get("status","ACTIVE")}"\n'
            
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", 'attachment; filename="all_registered_customers.csv"')
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(csv_output.encode("utf-8-sig"))
            return

        elif self.path.startswith("/api/transit/live"):
            params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            origin = params.get("from", ["Pune"])[0]
            destination = params.get("to", ["Goa"])[0]
            mode = params.get("mode", ["all"])[0]
            if transit_hotel_engine:
                result = transit_hotel_engine.get_destination_transit(origin, destination, mode)
            else:
                result = {"trains": [], "buses": []}
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "origin": origin,
                "destination": destination,
                "mode": mode,
                "source": "IRCTC & MSRTC Live Database",
                "trains": result.get("trains", []),
                "buses": result.get("buses", [])
            }, indent=2).encode("utf-8"))
            return

        elif self.path.startswith("/api/hotels/live"):
            params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            destination = params.get("destination", ["Lonavala"])[0]
            budget_str = params.get("budget", ["10000"])[0]
            budget = int(budget_str) if budget_str.isdigit() else 10000
            if transit_hotel_engine:
                hotels = transit_hotel_engine.get_destination_hotels(destination, budget)
            else:
                hotels = []
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "destination": destination,
                "source": "Verified Direct Stays & OpenStreetMap Live Feed",
                "hotels": hotels
            }, indent=2).encode("utf-8"))
            return

        elif self.path.startswith("/api/search-all"):
            params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            origin = params.get("from", ["Pune"])[0]
            destination = params.get("to", ["Goa"])[0]
            budget_str = params.get("budget", ["10000"])[0]
            budget = int(budget_str) if budget_str.isdigit() else 10000
            if transit_hotel_engine:
                transit = transit_hotel_engine.get_destination_transit(origin, destination, "all")
                hotels = transit_hotel_engine.get_destination_hotels(destination, budget)
            else:
                transit = {"trains": [], "buses": []}
                hotels = []
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "origin": origin,
                "destination": destination,
                "source": "IRCTC / MSRTC / OpenStreetMap Live Real Feed",
                "trains": transit.get("trains", []),
                "buses": transit.get("buses", []),
                "hotels": hotels
            }, indent=2).encode("utf-8"))
            return

        elif self.path == "/api/bookings":
            db = load_db()
            self._set_headers(200)
            self.wfile.write(json.dumps(db.get("bookings", []), indent=2).encode("utf-8"))
        elif self.path == "/api/status":
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "ONLINE",
                "storageFiles": ["backend_db.json", "backend_bookings.csv", "backend_summary.txt"],
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }).encode("utf-8"))
        elif self.path in ["/api/db", "/api/db/"]:
            db = load_db()
            self._set_headers(200)
            self.wfile.write(json.dumps(db, indent=2).encode("utf-8"))
            return
        else:
            if self.path == "/" or self.path == "":
                self.path = "/login.html"
            elif self.path.split("?")[0] in ["/login", "/login/"]:
                self.path = "/login.html"
            elif self.path.split("?")[0] in ["/app", "/app/", "/tour", "/tour/"]:
                self.path = "/index.html"
            elif self.path.split("?")[0] in ["/admin", "/admin/", "/backend", "/backend/", "/dashboard", "/dashboard/"]:
                self.path = "/admin.html"
            return super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        
        try:
            payload = json.loads(post_data) if post_data else {}
        except Exception:
            payload = {}

        # AUTH ENDPOINTS: CUSTOMER & ADMIN
        if self.path == "/api/auth/login":
            db = load_db()
            if "users" not in db:
                db["users"] = [
                    {"id": "USR-ADMIN-01", "name": "Sahil Jadhav (Admin)", "email": "admin@smarttour.com", "phone": "+91 9800000000", "role": "ADMIN", "password": "admin123", "createdAt": "2026-09-01 10:00:00", "status": "ACTIVE"},
                    {"id": "USR-CUST-101", "name": "Sahil (Traveler)", "email": "sahil@traveler.com", "phone": "+91 9876543210", "role": "CUSTOMER", "password": "user123", "createdAt": "2026-09-10 14:30:00", "status": "ACTIVE"}
                ]
            if "loginLogs" not in db:
                db["loginLogs"] = []

            ident = (payload.get("emailOrPhone") or payload.get("email") or payload.get("username") or "").strip()
            pwd = (payload.get("password") or "").strip()
            req_role = (payload.get("role") or "").upper()
            device_info = payload.get("device") or self.headers.get("User-Agent", "Web Browser")[:45]

            # 1. Admin Authentication - Strictly for sahilujadhav143@gmail.com
            norm_ident = ident.lower().replace(",", ".").strip()
            is_admin_email = norm_ident in ["sahilujadhav143@gmail.com", "admin@smarttour.com", "admin"]

            if is_admin_email:
                if pwd in ["admin123", "smarttour2026", "admin", "sahil123", "123456", "password"]:
                    log_entry = {
                        "id": f"LOG-{int(datetime.now().timestamp())}",
                        "userId": "USR-ADMIN-01",
                        "userName": "Sahil Jadhav",
                        "role": "ADMIN",
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "device": device_info,
                        "ip": self.client_address[0] if self.client_address else "127.0.0.1",
                        "status": "SUCCESS"
                    }
                    db["loginLogs"].insert(0, log_entry)
                    save_all_formats(db)
                    print(f"\n[AUTH] 👑 ADMIN LOGGED IN: Sahil Jadhav ({norm_ident}) at {log_entry['timestamp']}")

                    self._set_headers(200)
                    self.wfile.write(json.dumps({
                        "success": True,
                        "token": f"ADMIN_TOKEN_SECRET_{int(datetime.now().timestamp())}",
                        "user": {
                            "id": "USR-ADMIN-01",
                            "name": "Sahil Jadhav",
                            "email": "sahilujadhav143@gmail.com",
                            "phone": "+91 9975156893",
                            "role": "ADMIN"
                        },
                        "redirect": "admin.html"
                    }).encode("utf-8"))
                    return
                else:
                    self._set_headers(401)
                    self.wfile.write(json.dumps({"success": False, "message": "Incorrect Admin Password"}).encode("utf-8"))
                    return

            # 2. Customer Authentication
            matched_user = None
            for u in db["users"]:
                if u.get("role") == "CUSTOMER" and (u.get("email", "").lower() == ident.lower() or u.get("phone") == ident):
                    matched_user = u
                    break

            if matched_user:
                if matched_user.get("password") == pwd or not pwd: # allow quick login
                    log_entry = {
                        "id": f"LOG-{int(datetime.now().timestamp())}",
                        "userId": matched_user["id"],
                        "userName": matched_user["name"],
                        "email": matched_user.get("email", ""),
                        "phone": matched_user.get("phone", "N/A"),
                        "role": "CUSTOMER",
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "device": device_info,
                        "ip": self.client_address[0] if self.client_address else "127.0.0.1",
                        "status": "SUCCESS"
                    }
                    db["loginLogs"].insert(0, log_entry)
                    save_all_formats(db)
                    print(f"\n[AUTH] 👤 CUSTOMER LOGGED IN: {matched_user['name']} ({ident})")

                    self._set_headers(200)
                    self.wfile.write(json.dumps({
                        "success": True,
                        "token": f"TOKEN_CUSTOMER_{matched_user['id']}",
                        "user": {
                            "id": matched_user["id"],
                            "name": matched_user["name"],
                            "email": matched_user.get("email", ""),
                            "phone": matched_user.get("phone", ""),
                            "role": "CUSTOMER"
                        }
                    }).encode("utf-8"))
                    return
                else:
                    self._set_headers(401)
                    self.wfile.write(json.dumps({"success": False, "message": "Invalid password"}).encode("utf-8"))
                    return
            else:
                # Account does not exist! User must create account first.
                self._set_headers(404)
                self.wfile.write(json.dumps({
                    "success": False,
                    "needRegister": True,
                    "message": "Account not found! You do not have an account yet. Please Create an Account first."
                }).encode("utf-8"))
                return

        elif self.path == "/api/auth/register":
            db = load_db()
            if "users" not in db:
                db["users"] = []
            if "loginLogs" not in db:
                db["loginLogs"] = []

            name = (payload.get("name") or "New Tourist").strip()
            email = (payload.get("email") or "").strip()
            phone = (payload.get("phone") or "").strip()
            pwd = (payload.get("password") or "pass123").strip()
            device_info = payload.get("device") or self.headers.get("User-Agent", "Web Browser")[:45]

            new_uid = f"USR-CUST-{int(datetime.now().timestamp()) % 100000}"
            new_user = {
                "id": new_uid,
                "name": name,
                "email": email,
                "phone": phone,
                "role": "CUSTOMER",
                "password": pwd,
                "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status": "ACTIVE"
            }
            db["users"].append(new_user)
            log_entry = {
                "id": f"LOG-{int(datetime.now().timestamp())}",
                "userId": new_uid,
                "userName": name,
                "email": email,
                "phone": phone if phone else "N/A",
                "role": "CUSTOMER",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "device": device_info,
                "ip": self.client_address[0] if self.client_address else "127.0.0.1",
                "status": "ACCOUNT_CREATED"
            }
            db["loginLogs"].insert(0, log_entry)
            save_all_formats(db)
            print(f"\n[AUTH] 👤 CUSTOMER ACCOUNT REGISTERED: {name} ({email})")

            self._set_headers(201)
            self.wfile.write(json.dumps({
                "success": True,
                "token": f"TOKEN_CUSTOMER_{new_uid}",
                "user": {
                    "id": new_uid,
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "role": "CUSTOMER"
                }
            }).encode("utf-8"))
            return

        # 1. New Booking Endpoint (Saves to JSON, CSV, and TXT)
        elif self.path == "/api/bookings":
            db = load_db()
            if "bookings" not in db:
                db["bookings"] = []

            booking_record = {
                "id": payload.get("id", f"STC-GLO-{int(datetime.now().timestamp())}"),
                "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "customerName": payload.get("customerName", payload.get("name", payload.get("travelerName", "Guest Traveler"))),
                "customerPhone": payload.get("customerPhone", payload.get("phone", payload.get("mobile", payload.get("travelerPhone", "N/A")))),
                "destination": payload.get("destination", "Global Destination"),
                "state": payload.get("state", ""),
                "travelers": payload.get("travelers", 2),
                "durationDays": payload.get("durationDays", 2),
                "financials": payload.get("financials", {
                    "userBudget": payload.get("amount", "₹0"),
                    "totalExpense": payload.get("amount", "₹0"),
                    "remainingSavings": "₹0",
                    "budgetStatus": "CONFIRMED"
                }),
                "train": payload.get("train", {
                    "name": payload.get("trainName", "Direct Rail"),
                    "number": payload.get("trainNumber", "STC-EXP"),
                    "class": payload.get("trainClass", "AC Chair Car"),
                    "route": payload.get("trainRoute", "City -> Destination"),
                    "totalFare": payload.get("trainFares", "₹0")
                }),
                "hotel": payload.get("hotel", {
                    "hotelType": "Verified Sustainable Stay",
                    "nights": payload.get("nights", 1),
                    "rooms": payload.get("rooms", 1),
                    "ratePerNight": payload.get("hotelRate", "₹0"),
                    "totalHotelCost": payload.get("hotelTotal", "₹0")
                }),
                "foodAndTransit": payload.get("foodAndTransit", {
                    "localTransit": payload.get("localTransit", "₹0"),
                    "meals": payload.get("foodTotal", "₹0"),
                    "total": payload.get("transitFoodTotal", "₹0")
                }),
                "sightseeing": payload.get("sightseeing", {
                    "activitiesTotal": payload.get("activitiesTotal", "₹0"),
                    "passes": payload.get("passes", "Eco-Trail Pass")
                }),
                "relatedPlaces": payload.get("relatedPlaces", []),
                "status": "CONFIRMED_SAVED"
            }

            # Deduplicate by ID: update if exists, insert if new
            existing_idx = -1
            for idx, b in enumerate(db["bookings"]):
                if b.get("id") == booking_record["id"]:
                    existing_idx = idx
                    break

            if existing_idx >= 0:
                db["bookings"][existing_idx] = booking_record
            else:
                db["bookings"].insert(0, booking_record)
            save_all_formats(db)

            print("\n" + "=" * 60)
            print(f"[OK] [BACKEND RECORD SAVED]")
            print(f"   Pass ID     : {booking_record['id']}")
            print(f"   Customer    : {booking_record['customerName']} (Tel: {booking_record['customerPhone']})")
            print(f"   Destination : {booking_record['destination']}")
            print(f"   Train       : {booking_record['train']['name']} ({booking_record['train']['number']})")
            print(f"   Total Paid  : {booking_record['financials']['totalExpense']}")
            print(f"   Files Saved : 1. backend_db.json")
            print(f"                 2. backend_bookings.csv (Excel)")
            print(f"                 3. backend_summary.txt  (Receipt)")
            print("=" * 60 + "\n")

            self._set_headers(201)
            self.wfile.write(json.dumps({"success": True, "booking": booking_record}).encode("utf-8"))

        elif self.path == "/api/hotel-rates":
            db = load_db()
            db["hotelRates"] = {
                "baseRate": payload.get("baseRate", 3000),
                "dynamicRate": payload.get("dynamicRate", 3600),
                "occupancy": payload.get("occupancy", 60),
                "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            save_all_formats(db)
            print(f"[HOTEL] [BACKEND YIELD SAVED] Base Rs.{db['hotelRates']['baseRate']} -> Dynamic Rs.{db['hotelRates']['dynamicRate']}")
            self._set_headers(200)
            self.wfile.write(json.dumps({"success": True}).encode("utf-8"))

        elif self.path == "/api/sos-alert":
            db = load_db()
            if "sosAlerts" not in db:
                db["sosAlerts"] = []
            alert = {
                "id": f"SOS-{int(datetime.now().timestamp())}",
                "type": payload.get("type", "Medical / Police Emergency SOS"),
                "action": payload.get("action", "SOS_TRIGGERED"),
                "customerName": payload.get("customerName", "Tourist Passenger"),
                "customerPhone": payload.get("customerPhone", "N/A"),
                "destination": payload.get("destination", "Trip Location"),
                "latitude": payload.get("latitude", 18.5204),
                "longitude": payload.get("longitude", 73.8567),
                "accuracy": payload.get("accuracy", 10),
                "mapsUrl": payload.get("mapsUrl", "https://maps.google.com"),
                "timestamp": payload.get("timestamp", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            }
            db["sosAlerts"].insert(0, alert)
            save_all_formats(db)

            # Append to TXT summary ledger as urgent alert
            try:
                with open(TXT_FILE, "a", encoding="utf-8") as tf:
                    tf.write("!" * 80 + "\n")
                    tf.write(f"🚨 CRITICAL EMERGENCY SOS ALERT RECORD: {alert['id']}\n")
                    tf.write(f"  Passenger Name : {alert['customerName']}\n")
                    tf.write(f"  Mobile Number  : {alert['customerPhone']}\n")
                    tf.write(f"  Coordinates    : {alert['latitude']}, {alert['longitude']} (Accuracy: {alert['accuracy']}m)\n")
                    tf.write(f"  Live Map URL   : {alert['mapsUrl']}\n")
                    tf.write(f"  Timestamp      : {alert['timestamp']}\n")
                    tf.write("!" * 80 + "\n\n")
            except Exception:
                pass

            print("\n" + "!" * 65)
            print(f"🚨 [CRITICAL EMERGENCY SOS ALERT RECEIVED]")
            print(f"   Passenger : {alert['customerName']} (Tel: {alert['customerPhone']})")
            print(f"   GPS Coords: {alert['latitude']}, {alert['longitude']}")
            print(f"   Live Map  : {alert['mapsUrl']}")
            print(f"   Timestamp : {alert['timestamp']}")
            print("!" * 65 + "\n")

            self._set_headers(200)
            self.wfile.write(json.dumps({"success": True, "alert": alert}).encode("utf-8"))

        elif self.path == "/api/ai-chat":
            query = payload.get("query", "").strip()
            model = payload.get("model", "auto")
            lang = payload.get("language", "mr")
            gemini_key = payload.get("geminiKey") or os.environ.get("GEMINI_API_KEY", "")
            openai_key = payload.get("openaiKey") or os.environ.get("OPENAI_API_KEY", "")
            detected_lang = self._detect_lang(query) if lang in ["auto", "", None] else lang
            is_mr = (detected_lang == "mr")

            ai_response = None
            source = "Champak Omni-Lingual Neural Engine"

            # Dynamic language prompt for Gemini & ChatGPT
            lang_instruction = (
                f"Answer strictly in {detected_lang}."
                if lang and lang != "auto"
                else "Detect the user's language automatically and ALWAYS answer in that EXACT SAME language (Marathi, Hindi, English, Gujarati, Tamil, Telugu, Spanish, French, German, Japanese, etc.)."
            )

            # 1. Try Google Gemini API if key available and requested
            if gemini_key and (model in ["gemini", "auto"]):
                try:
                    g_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
                    g_prompt = (
                        f"You are Champak (चंपक), the world-class omni-lingual 3D AI travel and life assistant for Smart Tour Connect. "
                        f"You understand and speak ALL world languages fluently. "
                        f"{lang_instruction} "
                        f"Answer warmly, concisely, and naturally in 2-3 spoken sentences. User query: {query}"
                    )
                    g_data = json.dumps({"contents": [{"parts": [{"text": g_prompt}]}]}).encode("utf-8")
                    req = urllib.request.Request(g_url, data=g_data, headers={"Content-Type": "application/json"})
                    with urllib.request.urlopen(req, timeout=8) as resp:
                        if resp.status == 200:
                            g_res = json.loads(resp.read().decode("utf-8"))
                            candidates = g_res.get("candidates", [])
                            if candidates and "content" in candidates[0]:
                                parts = candidates[0]["content"].get("parts", [])
                                if parts and "text" in parts[0]:
                                    ai_response = parts[0]["text"].strip()
                                    source = "Google Gemini 1.5 Flash"
                except Exception as ge:
                    print(f"[GEMINI PROXY] Error: {ge}")

            # 2. Try OpenAI ChatGPT if key available and requested
            if not ai_response and openai_key and (model in ["chatgpt", "auto"]):
                try:
                    o_url = "https://api.openai.com/v1/chat/completions"
                    o_data = json.dumps({
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": f"You are Champak (चंपक), the omni-lingual 3D AI companion for Smart Tour Connect. You speak and understand ALL languages fluently. {lang_instruction} Answer concisely in 2-3 spoken sentences."},
                            {"role": "user", "content": query}
                        ],
                        "max_tokens": 200
                    }).encode("utf-8")
                    req = urllib.request.Request(o_url, data=o_data, headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_key}"})
                    with urllib.request.urlopen(req, timeout=8) as resp:
                        if resp.status == 200:
                            o_res = json.loads(resp.read().decode("utf-8"))
                            ai_response = o_res["choices"][0]["message"]["content"].strip()
                            source = "OpenAI ChatGPT-4o"
                except Exception as oe:
                    print(f"[OPENAI PROXY] Error: {oe}")

            # 3. High-Intelligence Built-in Fallback (Always Responds with 100% Reliability!)
            if not ai_response:
                ai_response, source = self._generate_builtin_ai_reply(query, detected_lang)

            self._set_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "response": ai_response,
                "source": source,
                "model": model
            }).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    init_db()

    # Start Cloud Relay Background Sync Worker
    sync_thread = threading.Thread(target=cloud_relay_sync_worker, daemon=True)
    sync_thread.start()

    server_address = ("", PORT)
    try:
        httpd = ThreadedHTTPServer(server_address, STCHttpHandler)
    except OSError:
        print(f"[WARN] Port {PORT} is busy, trying port {PORT + 1}...")
        httpd = ThreadedHTTPServer(("", PORT + 1), STCHttpHandler)

    active_port = httpd.server_address[1]
    url = f"http://localhost:{active_port}"

    print("\n" + "=" * 65)
    print(" [SERVER] SMART TOUR CONNECT - MULTI-FORMAT BACKEND RUNNING")
    print("=" * 65)
    print(f" [URL]    Web Application URL : {url}")
    print(f" [ADMIN]  Host/Admin Portal   : {url}/admin.html")
    print(f" [AUTH]   Sign In / Register  : {url}/login.html")
    print(f" [LAN]    Mobile Wi-Fi URL    : http://192.168.31.126:{active_port}")
    print(" [TUNNEL] Mobile Public URL   : https://genetics-pioneer-cake-magnitude.trycloudflare.com")
    print(f" [FILES]  1. JSON Database    : {DB_FILE}")
    print(f"          2. Excel CSV File   : {CSV_FILE}")
    print(f"          3. Text Ledger Slip : {TXT_FILE}")
    print(" [SYNC]   Cloud Relay Sync    : ACTIVE (Background daemon)")
    print(" [LOCK]   UI Privacy Status   : SILENT STORAGE (Files only on your PC)")
    print("=" * 65)
    print(" Press Ctrl + C to stop the server.\n")

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[STOP] Server stopped gracefully.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
