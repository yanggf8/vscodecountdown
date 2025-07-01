# Status Bar Format Testing Guide

## Test All 4 Format Variations

### Test Setup
1. Launch extension in Extension Development Host
2. Start a 5-minute timer: `Ctrl+Shift+P` → "Countdown: Start Timer" → `300`
3. Change format setting in VSCode settings and observe status bar changes

### Format Tests

#### Format 1: `mm:ss` (Default)
**Setting**: `"countdown.statusBarFormat": "mm:ss"`
**Expected**: `⏱️ 04:59 ████████ `
**Features**: 
- Timer icon
- MM:SS format
- Progress bar
- Updates every second

#### Format 2: `m分s秒` (Chinese)
**Setting**: `"countdown.statusBarFormat": "m分s秒"`  
**Expected**: `⏱️ 4分59秒 ████████`
**Features**:
- Timer icon
- Chinese minute/second characters
- Progress bar
- No leading zeros on minutes

#### Format 3: `簡潔` (Minimal)
**Setting**: `"countdown.statusBarFormat": "簡潔"`
**Expected**: `04:59`
**Features**:
- No icons
- No progress bar
- Clean MM:SS format only
- Most compact display

#### Format 4: `詳細` (Detailed)
**Setting**: `"countdown.statusBarFormat": "詳細"`
**Expected**: `⏱️ 04:59 ████████ (83%)`
**Features**:
- Timer icon  
- MM:SS format
- Progress bar
- Percentage display
- Most information

### Paused State Tests
Test each format when timer is paused:

#### Paused Format Examples
- `mm:ss`: `⏸️ 04:59 (已暫停)`
- `m分s秒`: `⏸️ 4分59秒 (已暫停)`
- `簡潔`: `⏸️ 04:59 (已暫停)`  
- `詳細`: `⏸️ 04:59 (已暫停)`

### Dynamic Testing
1. **Live Format Switching**: Change setting while timer is running
2. **Progress Validation**: Verify progress bar and percentage accuracy
3. **Time Accuracy**: Ensure all formats show same time values
4. **Chinese Characters**: Verify proper rendering of 分秒 characters

### Success Criteria
- [ ] All 4 formats display correctly
- [ ] Format changes apply immediately when setting is changed
- [ ] Progress bars render accurately in applicable formats
- [ ] Chinese characters display properly
- [ ] Minimal format has no extra icons/progress
- [ ] Detailed format shows percentage
- [ ] Paused state respects format setting
- [ ] Tooltips remain functional across all formats

### Bug Checklist
- [ ] No visual artifacts or alignment issues
- [ ] Progress calculation is consistent across formats
- [ ] Configuration changes take effect without restart
- [ ] Status bar width doesn't cause overflow
- [ ] All characters render properly on different platforms