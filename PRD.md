# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# AI Reality Show Simulator

Version: 1.0

Author: Wempy Aditya

---

# 1. OVERVIEW

## Project Name

AI Reality Show Simulator

## Description

AI Reality Show Simulator adalah aplikasi web berbasis AI yang memungkinkan pengguna membuat sebuah "dunia simulasi sosial" berisi beberapa karakter AI dengan kepribadian, tujuan, hubungan, dan pandangan yang berbeda.

Pengguna bertindak sebagai produser acara yang dapat menentukan:

* Karakter yang akan ikut dalam simulasi
* Kepribadian masing-masing karakter
* Hubungan antar karakter
* Topik utama diskusi
* Event yang mungkin terjadi
* Durasi simulasi

Setelah simulasi dimulai, karakter-karakter AI akan berinteraksi secara otomatis dalam bentuk percakapan, debat, aliansi, konflik, dan perubahan emosi tanpa campur tangan pengguna.

---

# 2. OBJECTIVES

## Primary Goal

Menciptakan pengalaman hiburan interaktif di mana pengguna dapat menyaksikan percakapan dan dinamika sosial antar AI secara real-time.

## Secondary Goals

* Menampilkan interaksi antar AI yang terasa hidup
* Menghasilkan percakapan yang unik setiap simulasi
* Menciptakan drama, konflik, dan humor secara emergent
* Menjadi sandbox untuk eksperimen multi-agent AI

---

# 3. TARGET USERS

### Casual Users

Pengguna yang ingin menikmati simulasi AI untuk hiburan.

### AI Enthusiasts

Pengguna yang ingin bereksperimen dengan agent dan model AI.

### Streamers / Content Creators

Pengguna yang ingin membuat konten berbasis simulasi AI.

---

# 4. CORE CONCEPT

Pengguna tidak ikut berbicara.

Pengguna hanya:

1. Mendesain dunia
2. Menekan tombol START
3. Menonton simulasi berjalan

Mirip:

* Reality Show
* Big Brother
* The Sims
* AI Agent Society

---

# 5. FUNCTIONAL REQUIREMENTS

# FR-01 Character Creator

User dapat membuat karakter secara bebas.

Field:

* Name
* Role
* Personality
* Goals
* Speaking Style
* Model Selection

Contoh:

Name:
Budi

Role:
Programmer

Personality:
Logical, introvert, critical

Goal:
Prove that programmers will not be replaced by AI

Speaking Style:
Technical and concise

Model:
Gemini 2.5 Flash

---

# FR-02 Character Management

User dapat:

* Add Character
* Edit Character
* Delete Character
* Duplicate Character

Maximum:

* 20 characters

Minimum:

* 2 characters

---

# FR-03 Relationship Builder

User dapat menentukan hubungan antar karakter.

Relationship Types:

* Likes
* Dislikes
* Neutral
* Admirer
* Rival
* Mentor
* Student

Contoh:

Programmer dislikes Influencer

Dosen mentors Mahasiswa

---

# FR-04 Topic Setup

User menentukan topik utama.

Contoh:

* Is AI replacing programmers?
* Should college be abolished?
* Humans should live on Mars
* Anime is better than movies

Topik ini menjadi konteks utama simulasi.

---

# FR-05 Event Configuration

User dapat memilih event.

Default Events:

* Internet Outage
* Global AI Takeover
* Alien Arrival
* 1 Billion Dollar Prize
* Economic Crisis
* Power Blackout

Custom Event:

User dapat membuat event sendiri.

Contoh:

"Dosen suddenly becomes TikTok famous."

---

# FR-06 Simulation Settings

User dapat mengatur:

Rounds

Contoh:

10
50
100
Unlimited

Response Length

* Short
* Medium
* Long

Event Frequency

* Every 3 rounds
* Every 5 rounds
* Every 10 rounds

Simulation Mode

* Normal
* Debate
* Chaos
* Comedy
* Political
* Survival

---

# FR-07 Director Agent

System memiliki Director Agent.

Director Agent tidak ikut berbicara.

Tugas:

* Menentukan siapa yang berbicara berikutnya
* Menentukan kapan event terjadi
* Menentukan konflik
* Menentukan perubahan suasana

---

# FR-08 Character Memory

Setiap karakter memiliki memori.

Memori menyimpan:

* Percakapan sebelumnya
* Konflik
* Dukungan
* Pengkhianatan
* Event penting

Contoh:

Memory:

Influencer mocked me yesterday.

Mahasiswa agreed with my opinion.

---

# FR-09 Emotion System

Setiap karakter memiliki emosi.

Attributes:

* Happiness
* Anger
* Confidence
* Trust
* Stress

Range:

0 - 100

Emosi berubah berdasarkan interaksi.

---

# FR-10 Alliance System

Karakter dapat:

* Membentuk aliansi
* Menjadi musuh
* Berpindah kubu

Secara otomatis selama simulasi.

---

# FR-11 Drama Log

Sistem menghasilkan narasi otomatis.

Contoh:

BREAKING NEWS

Budi feels offended by Rina.

Pak Slamet supports Budi.

Influencer loses public trust.

---

# FR-12 Live Simulation

Percakapan berjalan real-time.

Contoh:

[Round 12]

Budi:
AI still requires programmers.

Rina:
But AI content gets more views.

Pak Slamet:
That statement lacks evidence.

---

# FR-13 Pause / Resume

User dapat:

Pause

Resume

Stop

Restart

Simulation

---

# FR-14 Save Scenario

User dapat menyimpan konfigurasi dunia.

Format:

JSON

Contoh:

world_001.json

---

# FR-15 Load Scenario

User dapat memuat ulang skenario yang telah disimpan.

---

# 6. NON-FUNCTIONAL REQUIREMENTS

Performance

* Response under 3 seconds per turn

Scalability

* Support up to 20 agents

Usability

* Beginner-friendly

Reliability

* Auto-save every 30 seconds

---

# 7. SYSTEM ARCHITECTURE

Frontend (yang mudah/simple setup nya dan tidak berat, dan UI nya bagus)

React
Next.js
TailwindCSS

Backend

Node.js
Express.js

Alternative:

FastAPI

Database

SQLite (MVP)

Realtime

Socket.IO

LLM Providers

OpenAI

9Router

OpenRouter

---

# 8. AGENT ARCHITECTURE

World State

Contains:

* Topic
* Characters
* Relationships
* Memories
* Emotions
* Events

Director Agent

Responsible for:

* Flow Control
* Turn Selection
* Event Trigger

Character Agents

Responsible for:

* Thinking
* Speaking
* Reacting

Memory Engine

Responsible for:

* Memory Storage
* Context Retrieval

Relationship Engine

Responsible for:

* Alliance Updates
* Conflict Updates

Event Engine

Responsible for:

* Event Trigger
* Event Effects

---

# 9. USER INTERFACE

Screen 1

Landing Page

Buttons:

* Create Simulation
* Load Simulation

---

Screen 2

World Builder

Sections:

* Topic
* Characters
* Relationships
* Events
* Settings

Button:

START SIMULATION

---

Screen 3

Live Simulation

Layout

Left Panel

Character List

Center

Live Conversation

Right Panel

Events
Drama Log
Statistics

Top

Pause
Resume
Restart

---

# 10. FUTURE FEATURES

Avatar Generator

AI-generated portraits for each character.

Voice Simulation

Characters speak with synthetic voices.

Viewer Interaction

Audience can send events.

Streaming Mode

Optimized for YouTube and Twitch.

Multi-Room Reality Show

Multiple AI houses interacting together.

Tournament Mode

Multiple groups competing with each other.

---

# SUCCESS CRITERIA

The project is successful when:

* Users can create custom characters
* Characters interact autonomously
* Conversations remain coherent
* Relationships evolve over time
* Events affect the simulation
* Every simulation produces unique outcomes

End of PRD
