-- SQL to RESET and insert clean data into the blogs table
-- This script prevents DUPLICATES by clearing the table first.
-- It also uses absolute paths for images to ensure they load on Vercel.

TRUNCATE TABLE blogs;

INSERT INTO blogs (title, description, meta, image_url, pdf_url, read_url, theme, is_coming_soon, order_index)
VALUES 
('Signal Over Noise', 'The definitive IPFS framework for navigating volatility and building lasting generational wealth.', 'Featured Publication', '/assets/blog_whitepaper.png', '/assets/Signal_Over_Noise .pdf', 'signal-report.html', 'dark', false, 1),

('Annual Market Outlook 2025', 'Forward-looking analysis of key macro trends shaping Indian and global markets in 2025.', 'Market Intelligence · 2025', '/assets/outlook-2025.png', '/assets/Annual Market Outlook 2025.pdf', 'outlook-2025.html', 'light', false, 2),

('Annual Market Outlook 2024', 'Equity cycle inflection points and multi-asset strategies mapped for the year 2024.', 'Annual Outlook · 2024', '/assets/outlook-2024.png', '/assets/Annual Market Outlook 2024.pdf', 'outlook-2024.html', 'dark', false, 3),

('IPFS Market Outlook 2023', 'A comprehensive review of 2023''s market landscape guiding elite portfolio decisions with precision.', 'Institutional Insights · 2023', '/assets/outlook-2023.png', '/assets/IPFS Market Outlook 2023.pdf', 'outlook-2023.html', 'light', false, 4),

('Equity Outlook 2020–21', 'Global equity frameworks and precision capital allocation for navigating the 2020–21 economic cycle.', 'Equity Research · 2020', '/assets/equity-outlook.png', '/assets/Equity-Outlook-2020-2021-IPFS.pdf', 'equity-report.html', 'dark', false, 5),

('Nifty 19500: Road Ahead', 'Where does the market go after 19500? A pinpoint tactical note with data-backed directional views.', 'Tactical Report · Jul 2023', '/assets/nifty-road.png', '/assets/Nifty 19500 Market Outlook n way forward July 2023.pdf', 'nifty-report.html', 'light', false, 6),

('Wealth through Cycles', 'How understanding market rhythm creates compounding advantages and generational wealth over time.', 'Wealth Philosophy', '/assets/wealth-cycles.png', '/assets/Wealth Creation thru Market cycles.pdf', 'wealth-cycles.html', 'dark', false, 7),

('Markets: 2000–07 Parallels', 'A data-driven study drawing parallels between today''s market structure and the historic 2000–07 bull.', 'Historical Analysis', '/assets/correlation.png', '/assets/Correlation of Current Market situation with 2000-2007 period.pdf', 'correlation-report.html', 'light', false, 8),

('The Compounding Architect', 'How structural systematic plans transform modest capital into elite wealth reservoirs over time.', 'Premium Series', '/assets/wealth-cycles.png', NULL, NULL, 'dark', true, 9),

('Tax-Optimized Alpha', 'Engineered strategies to maximize retained returns through intelligent, proactive tax planning.', 'Wealth Optimization', '/assets/tax-alpha.png', NULL, NULL, 'light', true, 10);
