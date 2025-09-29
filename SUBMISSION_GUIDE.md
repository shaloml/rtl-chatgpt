# Submission Guide

This guide walks you through submitting the Claude AI RTL Transformer extension to both Chrome Web Store and Microsoft Edge Add-ons.

---

## Before You Submit

### Required Files
✅ All files are included in `claude-ai-rtl-transformer-v2.0.zip`:
- manifest.json
- background.js
- icon16.png, icon48.png, icon128.png
- README.md
- LICENSE

### Recommended Preparations
- [ ] Create 5-8 screenshots (1280x800 or 640x400 recommended)
- [ ] Record a short demo video (optional but highly recommended)
- [ ] Prepare promotional images (if required by stores)
- [ ] Have payment ready ($5 one-time fee for Chrome Web Store)

---

## Chrome Web Store Submission

### Step 1: Developer Account Setup
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account
3. Pay the one-time $5 developer registration fee (if not already paid)
4. Accept the developer agreement

### Step 2: Create New Item
1. Click "New Item" button
2. Upload `claude-ai-rtl-transformer-v2.0.zip`
3. Click "Upload"

### Step 3: Fill Store Listing (Product Details)

**Store Listing Language:** English

**Extension Name:**
```
Claude AI RTL Transformer
```

**Summary (132 characters max):**
```
Toggle RTL/LTR directions in Claude AI. Adds smart buttons to code blocks & chat inputs for Hebrew & Arabic speakers.
```

**Description:**
Copy from `STORE_LISTING.md` → Detailed Description section

**Category:**
- Primary: Accessibility
- (or) Productivity

**Language:**
English

### Step 4: Graphics

**Icon (128x128):** Already included in ZIP

**Screenshots (Required - at least 1, max 5):**
Upload screenshots showing:
1. Code block with toggle button
2. Conversation input with toggle button
3. Hebrew/Arabic text in action
4. Before/After comparison
5. Global toggle demonstration

**Promotional Tile (440x280) - Optional but recommended**

**Marquee Tile (1400x560) - Optional**

### Step 5: Privacy Practices

**Single Purpose:**
```
Provides RTL/LTR text direction control specifically for Claude AI interface to improve readability for Hebrew and Arabic speakers.
```

**Permission Justification:**
```
- activeTab: Required to access the current Claude AI tab when user clicks the extension icon
- scripting: Required to inject RTL/LTR toggle functionality into the page
- host_permissions (claude.ai): Restricts extension to only work on Claude AI for security and privacy
```

**Are you using remote code?** NO

**Data Usage:**
- Does NOT collect user data
- Does NOT use analytics
- Does NOT transmit data
- Operates entirely locally

**Privacy Policy:** (Optional for this extension, but recommended)
```
This extension does not collect, store, or transmit any user data. It operates entirely within your browser and only modifies the visual presentation of the Claude AI interface.
```

### Step 6: Distribution

**Visibility:** Public

**Regions:** All regions (or select specific regions)

**Pricing:** Free

### Step 7: Review & Submit
1. Review all information
2. Click "Submit for Review"
3. Wait for approval (typically 1-3 business days)

---

## Microsoft Edge Add-ons Submission

### Step 1: Partner Center Account
1. Go to [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview)
2. Sign in with Microsoft account
3. Enroll in Microsoft Edge program (FREE - no registration fee)

### Step 2: Create New Submission
1. Click "Create new extension"
2. Upload `claude-ai-rtl-transformer-v2.0.zip`

### Step 3: Fill Properties

**Display Name:**
```
Claude AI RTL Transformer
```

**Description:**
Copy from `STORE_LISTING.md` → Detailed Description section

**Category:**
- Accessibility Tools
- (or) Productivity

**Supported Languages:**
English

### Step 4: Listings

**Short Description:**
```
Toggle RTL/LTR directions in Claude AI. Smart buttons for code blocks & chat inputs. Perfect for Hebrew & Arabic.
```

**Detailed Description:**
Same as Chrome Web Store

**Screenshots (Required - 1-10):**
Same screenshots as Chrome Web Store

**Logo (128x128):** Already included in ZIP

### Step 5: Package Upload
Already uploaded in Step 2

### Step 6: Availability

**Markets:** Select all or specific countries

**Visibility:** Public

**Pricing:** Free

### Step 7: Properties

**Category:** Accessibility

**Privacy Policy URL:** (Optional)
Leave blank or provide URL

**Website:** (Optional)
Your GitHub repository URL

**Support Contact:**
```
shaloml@gmail.com
```

### Step 8: Submit
1. Review all sections
2. Click "Submit"
3. Wait for approval (typically 1-5 business days)

---

## Post-Submission

### What to Expect
- **Chrome:** Review typically takes 1-3 business days
- **Edge:** Review typically takes 1-5 business days
- Both may request changes if issues are found

### Common Rejection Reasons (to avoid)
- ❌ Incorrect permissions justification
- ❌ Misleading screenshots
- ❌ Unclear description
- ❌ Trademark issues in name
- ❌ Extension doesn't work as described

### After Approval
1. Extension will be published to stores
2. You'll receive confirmation email
3. Extension will be searchable within 24 hours
4. Monitor reviews and ratings
5. Respond to user feedback

---

## Updating the Extension

### For Future Updates
1. Update version number in `manifest.json`
2. Create new ZIP file with updated files
3. Update CHANGELOG.md
4. Upload new ZIP to store dashboards
5. Update "What's New" section
6. Submit for review

### Version Numbering
Follow semantic versioning:
- **Major (X.0.0):** Breaking changes or major new features
- **Minor (2.X.0):** New features, backward compatible
- **Patch (2.0.X):** Bug fixes only

---

## Support & Maintenance

### Monitoring
- Check store dashboards regularly for reviews
- Monitor user reports
- Track bug reports via email

### Response Time
- Respond to reviews within 48 hours
- Address critical bugs within 1 week
- Plan feature updates quarterly

---

## Useful Links

### Chrome Web Store
- Developer Dashboard: https://chrome.google.com/webstore/devconsole/
- Documentation: https://developer.chrome.com/docs/webstore/
- Policies: https://developer.chrome.com/docs/webstore/program-policies/

### Microsoft Edge Add-ons
- Partner Center: https://partner.microsoft.com/dashboard/microsoftedge/
- Documentation: https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/
- Policies: https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/store-policies/

---

## Checklist Before Submission

- [ ] ZIP file created and tested
- [ ] Screenshots prepared (5-8 images)
- [ ] Store listing text ready
- [ ] Privacy policy prepared
- [ ] Support email active
- [ ] Extension tested on Chrome
- [ ] Extension tested on Edge
- [ ] Version number correct (2.0.0)
- [ ] CHANGELOG updated
- [ ] README updated
- [ ] License file included

---

Good luck with your submission! 🚀