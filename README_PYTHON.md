# AI Readiness Assessment Report Generator

This Python script generates PDF reports with spider/radar charts based on AI readiness assessment results.

## Features

- ✅ Generates professional spider/radar charts matching your design
- ✅ Calculates scores across 6 key categories
- ✅ Produces high-quality PDF reports
- ✅ Supports JSON input for easy integration
- ✅ Configurable and extensible

## Installation

### Prerequisites

Make sure you have Python 3.7+ installed.

### Install Dependencies

```bash
# Using apt (Debian/Ubuntu)
sudo apt-get install python3-matplotlib python3-numpy

# OR using pip
pip3 install matplotlib numpy
```

Alternatively, install from requirements file:

```bash
pip3 install -r requirements-python.txt
```

## Usage

### Option 1: Generate Sample Report

Run without arguments to generate a sample report with test data:

```bash
python3 generate_assessment_report.py
```

This creates `sample_assessment_report.pdf` with all categories scoring 75%.

### Option 2: Generate from JSON File

Provide a JSON file with answer scores:

```bash
python3 generate_assessment_report.py answers.json output.pdf
```

**JSON Format:**
```json
{
  "1": 75,
  "2": 50,
  "3": 100,
  ...
  "15": 75
}
```

Where each number (1-15) represents a question, and the value is the points earned (0-100).

### Examples

```bash
# Generate report for a "Lagging" level organization
python3 generate_assessment_report.py example_lagging.json lagging_report.pdf

# Generate report for an "Advanced" level organization
python3 generate_assessment_report.py example_advanced.json advanced_report.pdf

# Generate with custom data
python3 generate_assessment_report.py sample_answers.json my_report.pdf
```

## Assessment Categories

The assessment evaluates 6 key dimensions:

1. **Foundation & Infrastructure** (Questions 1-3)
   - Data quality and integration
   - System and supplier integration
   - Cloud and digital infrastructure

2. **Process & Operations** (Questions 4-6)
   - Process standardization and automation
   - Spend visibility and analytics
   - External data integration

3. **Strategy & Leadership** (Questions 7-8)
   - Leadership support and change management
   - Digital strategy and risk management

4. **Governance & Compliance** (Question 12)
   - Compliance and audit readiness

5. **Talent & Capabilities** (Questions 9-11)
   - Skills and talent
   - AI use case identification
   - AI maturity goals

6. **Measurement & Investment** (Questions 13-15)
   - KPI and metrics framework
   - Decision-making process
   - Budget and implementation timeline

## Score Calculation

- Each question can earn 0-100 points based on the selected answer
- Category scores are calculated as the average of their questions' scores
- Overall score is the average of all category scores
- Scores map to maturity levels:
  - **0-42%**: Lagging
  - **43-61%**: Emerging
  - **62-80%**: Scaling
  - **81-100%**: Advanced

## Output

The script generates a PDF with:
- Spider/radar chart showing scores across all 6 categories
- Overall score displayed in the center
- Percentage labels at each data point
- Professional styling matching your brand colors
- 300 DPI high-resolution output

## Integration with Web Application

To integrate with your React/TypeScript application:

1. **Backend API**: Create an endpoint that receives assessment answers
2. **Call Python Script**: Execute the script via subprocess or API
3. **Return PDF**: Send the generated PDF back to the user

Example integration (Node.js):

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

// Save answers to JSON
fs.writeFileSync('temp_answers.json', JSON.stringify(answers));

// Generate PDF
execSync('python3 generate_assessment_report.py temp_answers.json report.pdf');

// Send PDF to user
res.download('report.pdf');
```

## Customization

### Modify Colors

Edit the script to change the color scheme:

```python
# Line ~158: Fill color
ax.fill(angles, scores, color='#00A1A1', alpha=0.25)

# Line ~161: Outline color
ax.plot(angles, scores, color='#008585', linewidth=2.5)
```

### Adjust Chart Size

Change figure size on line ~116:

```python
fig = plt.figure(figsize=(10, 10), facecolor='white')
```

### Modify Title

Pass custom title when calling the function:

```python
generator.create_spider_chart(
    category_scores,
    filename="report.pdf",
    title="Custom Assessment Title"
)
```

## Troubleshooting

### "No module named 'matplotlib'"

Install matplotlib:
```bash
pip3 install matplotlib numpy
```

### "posx and posy should be finite values" warning

This is a harmless warning from matplotlib and can be ignored. The PDF is generated successfully.

### Font issues

If you see font warnings, install additional fonts:
```bash
sudo apt-get install fonts-dejavu fonts-liberation
```

## Files

- `generate_assessment_report.py` - Main script
- `requirements-python.txt` - Python dependencies
- `sample_answers.json` - Example input with balanced scores
- `example_lagging.json` - Example for low maturity level
- `example_advanced.json` - Example for high maturity level

## License

This script is part of the Valorant AI Readiness Assessment project.

## Support

For questions or issues, please contact the development team.

