# QuestionForm Webflow Component - Quick Start Guide

## 🚀 Quick Commands

```bash
# Step 1: Login to Webflow
yarn webflow:dev
# or: npx webflow login

# Step 2: Test locally (opens dev server)
yarn webflow:dev
# or: npx webflow dev

# Step 3: Publish to Webflow
yarn webflow:publish
# or: npx webflow publish
```

## 📦 What's Included

- **QuestionForm.tsx** - Main React component
- **QuestionForm.webflow.tsx** - Webflow component wrapper
- **webflow.json** - Webflow configuration

## 🎯 Component Features

✅ Multi-step question flow with progress indicator  
✅ Animated transitions between questions  
✅ Custom event on completion (`questionFormComplete`)  
✅ Dark theme with cyan accents  
✅ Fully responsive design  
✅ Customizable questions via JSON

## 📝 Using in Webflow

### 1. Login & Publish

```bash
npx webflow login
npx webflow publish
```

### 2. Add to Your Site

1. Open Webflow Designer
2. Press **"+"** to add elements
3. Go to **Components** → **Valorant Code Components**
4. Drag **"Question Form"** onto your canvas

### 3. Configure Questions (Optional)

In the component settings, add custom questions as JSON:

```json
[
  {
    "category": "Your Category",
    "question": "Your question here?",
    "choices": [
      { "id": "A", "text": "First option" },
      { "id": "B", "text": "Second option" },
      { "id": "C", "text": "Third option" },
      { "id": "D", "text": "Fourth option" }
    ]
  }
]
```

### 4. Listen for Completion (Optional)

Add to your page's **Custom Code (Footer)**:

```html
<script>
window.addEventListener('questionFormComplete', function(event) {
  console.log('Answers:', event.detail.answers);
  
  // Send to your backend
  fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event.detail.answers)
  });
});
</script>
```

## 🎨 Default Styling

- **Background**: Dark blue (`#0a0e27`)
- **Progress bars**: Cyan (`cyan-400`, `cyan-600`)
- **Buttons**: White with gray borders
- **Text**: White for questions, cyan for categories

## 🔧 Troubleshooting

### "Component not found"
→ Run `npx webflow publish` again and refresh Webflow Designer

### "Invalid JSON"
→ Validate your questions JSON at [jsonlint.com](https://jsonlint.com)

### Changes not showing
→ Increment version, republish, and hard refresh (Cmd/Ctrl + Shift + R)

## 📚 Full Documentation

See [WEBFLOW_SETUP.md](./WEBFLOW_SETUP.md) for complete documentation.

## 🆘 Need Help?

- Webflow Docs: https://developers.webflow.com/
- Component source: `src/components/QuestionForm.tsx`
- Webflow wrapper: `src/components/QuestionForm.webflow.tsx`

