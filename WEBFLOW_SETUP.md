# Webflow Integration Guide for QuestionForm Component

This guide will help you publish your QuestionForm component to Webflow and use it in your Webflow projects.

## Prerequisites

1. Node.js and npm/yarn installed
2. Webflow account with Designer access
3. Webflow CLI installed globally: `npm install -g @webflow/webflow-cli`

## Project Setup

The project is already configured with:
- `@webflow/react` - Webflow React integration
- `@webflow/data-types` - Webflow prop types
- `@webflow/webflow-cli` - CLI for publishing components
- `webflow.json` - Webflow library configuration

## Component Structure

```
src/
├── components/
│   ├── QuestionForm.tsx          # Main React component
│   └── QuestionForm.webflow.tsx  # Webflow component declaration
└── webflow.json                   # Webflow configuration
```

## Publishing to Webflow

### Step 1: Login to Webflow CLI

```bash
webflow login
```

This will open a browser window for authentication.

### Step 2: Initialize Webflow Project (if not already done)

```bash
webflow init
```

Follow the prompts to:
- Create a new library or connect to an existing one
- Set up your component library name

### Step 3: Build and Test Locally

```bash
# Install dependencies if needed
yarn install

# Test the component locally
webflow dev
```

This starts a local development server where you can preview your component.

### Step 4: Publish to Webflow

```bash
# Build for production
yarn build

# Publish to Webflow
webflow publish
```

Your component will now be available in your Webflow Designer!

## Using the Component in Webflow

### 1. Add Component to Your Site

1. Open your Webflow project in the Designer
2. Go to the "Add" panel (+)
3. Navigate to "Components" → "Your Library Name"
4. Drag the "Question Form" component onto your canvas

### 2. Configure the Component

The QuestionForm component has the following customizable property:

- **Questions JSON**: A JSON string containing your custom questions

#### Default Behavior
If you leave the Questions JSON field empty, it will use the default procurement questions.

#### Custom Questions Format

To use custom questions, provide a JSON array in this format:

```json
[
  {
    "category": "Your Category",
    "question": "Your question text here?",
    "choices": [
      {
        "id": "A",
        "text": "First choice text"
      },
      {
        "id": "B",
        "text": "Second choice text"
      },
      {
        "id": "C",
        "text": "Third choice text"
      },
      {
        "id": "D",
        "text": "Fourth choice text"
      }
    ]
  }
]
```

### 3. Handle Form Completion

The component dispatches a custom event when all questions are answered. Add this code to your Webflow page's custom code (Settings → Custom Code → Footer Code):

```html
<script>
  window.addEventListener('questionFormComplete', function(event) {
    console.log('User answers:', event.detail.answers);
    
    // Example: Send to your API
    fetch('https://your-api.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event.detail.answers)
    });
    
    // Example: Show a success message
    alert('Thank you for completing the survey!');
  });
</script>
```

## Styling

The component uses Tailwind CSS with a dark theme:
- Background: `#0a0e27` (dark blue)
- Accent color: Cyan
- White text for questions
- White buttons with gray borders

To customize colors, you'll need to modify the component source code and republish.

## Example Questions Object

Here's the default questions structure used in the component:

```javascript
[
  {
    category: "Foundation & Infrastructure",
    question: "How would you rate the current state of your procurement and supply chain data?",
    choices: [
      { id: "A", text: "Highly fragmented across multiple systems..." },
      { id: "B", text: "Partially integrated with some data quality concerns" },
      { id: "C", text: "Mostly integrated with good data quality..." },
      { id: "D", text: "Fully integrated with high quality, real-time data..." }
    ]
  },
  // Add more questions...
]
```

## Troubleshooting

### Component Not Showing
- Ensure the component was published successfully
- Refresh your Webflow Designer
- Check browser console for errors

### Styling Issues
- Make sure Tailwind CSS is properly configured
- Check that all CSS is being bundled correctly
- Verify the component container has enough space

### Questions Not Updating
- Validate your JSON format using a JSON validator
- Check browser console for parsing errors
- Ensure no trailing commas in the JSON

## Development Workflow

1. Make changes to `src/components/QuestionForm.tsx` or `QuestionForm.webflow.tsx`
2. Test locally with `webflow dev`
3. Build with `yarn build`
4. Publish with `webflow publish`
5. Refresh Webflow Designer to see updates

## Support

For issues with:
- **Webflow CLI**: [Webflow Developer Docs](https://developers.webflow.com/)
- **Component Code**: Check the source files in `src/components/`
- **React Issues**: See React documentation

## License

This component is part of the Valorant Code Components library.

