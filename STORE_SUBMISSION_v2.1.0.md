# Chrome Web Store Submission - v2.1.0

## Version Notes (paste into "Changes in this version")

RTL layout improvements and bug fix:

- Sidebar now flips to the right side in RTL mode for a natural Hebrew/Arabic reading experience
- Fixed: code block and markdown block LTR/RTL toggle buttons were not working (label changed but direction stayed the same)

## Testing Checklist

- [ ] Load extension in chrome://extensions/ (Developer mode → Load unpacked)
- [ ] Navigate to https://claude.ai and open a conversation
- [ ] Click extension icon to activate RTL
- [ ] Verify sidebar moves to the right side
- [ ] Verify code block LTR button toggles to RTL and text direction actually changes
- [ ] Verify markdown block LTR button toggles to RTL
- [ ] Verify fieldset RTL button toggles to LTR
- [ ] Verify sidebar expands/collapses normally from the right
- [ ] Click extension icon again to deactivate - sidebar returns to left
