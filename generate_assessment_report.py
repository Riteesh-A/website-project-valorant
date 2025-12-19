#!/usr/bin/env python3
"""
AI Readiness Assessment Report Generator
Generates a comprehensive PDF report with spider/radar chart based on assessment results.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import Rectangle, FancyBboxPatch
import numpy as np
from matplotlib.backends.backend_pdf import PdfPages
import json
from typing import Dict, List, Tuple
from matplotlib.patches import Circle
import textwrap


class AssessmentReportGenerator:
    """Generate assessment reports with spider charts"""
    
    # Define the 6 categories and their question mappings
    CATEGORIES = {
        "Foundation & Infrastructure": [1, 2, 3],
        "Process & Operations": [4, 5, 6],
        "Strategy & Leadership": [7, 8],
        "Governance & Compliance": [12],
        "Talent & Capabilities": [9, 10, 11],
        "Measurement & Investment": [13, 14, 15]
    }
    
    # Maximum points per question (based on the choices structure)
    QUESTION_MAX_POINTS = {
        1: 100, 2: 100, 3: 100,  # Foundation & Infrastructure
        4: 100, 5: 100, 6: 100,  # Process & Operations
        7: 100, 8: 100,          # Strategy & Leadership
        9: 100, 10: 100, 11: 100, # Talent & Capabilities
        12: 100,                 # Governance & Compliance
        13: 100, 14: 100, 15: 100 # Measurement & Investment
    }
    
    # Assessment levels with recommendations
    ASSESSMENT_LEVELS = {
        "LAGGING": {
            "min": 0,
            "max": 42,
            "title": "beginning of its AI journey",
            "intro_text": "Start with pilot projects that can demonstrate quick wins and build momentum.",
            "timeline": "12-18 months",
            "next_level": "Developing",
            "focus_title": "Building foundational capabilities",
            "focus_areas": [
                "CONSOLIDATING\nDATA",
                "STANDARDIZING\nPROCESSES",
                "DEVELOPING\nLEADERSHIP BUY-IN"
            ],
            "prioritise_title": "Focusing effort on strategic investment",
            "priorities": [
                "DATA QUALITY\nIMPROVEMENT",
                "STANDARDIZING\nPROCESSES",
                "BASIC AUTOMATION OF\nROUTINE TASKS"
            ]
        },
        "EMERGING": {
            "min": 43,
            "max": 61,
            "title": "establishing basic digital capabilities",
            "intro_text": "Scale your automation initiatives and implement advanced analytics.",
            "timeline": "12-24 months",
            "next_level": "Advanced",
            "focus_title": "Advancing digital transformation",
            "focus_areas": [
                "SCALING\nAUTOMATION",
                "IMPLEMENTING\nADVANCED ANALYTICS",
                "DEVELOPING AI\nBUSINESS CASES"
            ],
            "prioritise_title": "Building AI readiness",
            "priorities": [
                "WORKFORCE\nUPSKILLING",
                "GOVERNANCE\nFRAMEWORKS",
                "AI USE CASE\nIDENTIFICATION"
            ]
        },
        "SCALING": {
            "min": 62,
            "max": 80,
            "title": "well-positioned with strong digital foundations",
            "intro_text": "Implement advanced AI applications and expand real-time capabilities.",
            "timeline": "6-12 months",
            "next_level": "Optimized",
            "focus_title": "Implementing advanced AI capabilities",
            "focus_areas": [
                "ADVANCED AI\nAPPLICATIONS",
                "REAL-TIME\nCAPABILITIES",
                "INDUSTRY\nCOLLABORATION"
            ],
            "prioritise_title": "Achieving AI excellence",
            "priorities": [
                "PREDICTIVE\nANALYTICS",
                "AUTONOMOUS\nSYSTEMS",
                "INNOVATION\nCENTERS"
            ]
        },
        "ADVANCED": {
            "min": 81,
            "max": 100,
            "title": "achieved excellence",
            "intro_text": "Maintain leadership through continuous innovation and emerging technologies.",
            "timeline": "ongoing",
            "next_level": None,
            "focus_title": "Sustaining competitive advantage",
            "focus_areas": [
                "CONTINUOUS\nINNOVATION",
                "EMERGING\nTECHNOLOGIES",
                "INDUSTRY\nLEADERSHIP"
            ],
            "prioritise_title": "Pioneering next-generation capabilities",
            "priorities": [
                "QUANTUM\nCOMPUTING",
                "ADVANCED\nAUTONOMY",
                "IP DEVELOPMENT"
            ]
        }
    }
    
    def __init__(self):
        """Initialize the report generator"""
        pass
    
    def calculate_category_scores(self, answers: Dict[int, int]) -> Dict[str, float]:
        """
        Calculate percentage score for each category based on answers.
        
        Args:
            answers: Dict mapping question number (1-15) to points earned
            
        Returns:
            Dict mapping category name to percentage score (0-100)
        """
        category_scores = {}
        
        for category, questions in self.CATEGORIES.items():
            total_points = 0
            max_points = 0
            
            for q_num in questions:
                total_points += answers.get(q_num, 0)
                max_points += self.QUESTION_MAX_POINTS[q_num]
            
            # Calculate percentage
            percentage = (total_points / max_points * 100) if max_points > 0 else 0
            category_scores[category] = percentage
        
        return category_scores
    
    def get_assessment_level(self, overall_score: float) -> Dict:
        """Get the assessment level based on overall score"""
        for level_name, level_data in self.ASSESSMENT_LEVELS.items():
            if level_data["min"] <= overall_score <= level_data["max"]:
                return {**level_data, "name": level_name}
        return {**self.ASSESSMENT_LEVELS["LAGGING"], "name": "LAGGING"}
    
    def create_comprehensive_report(self, category_scores: Dict[str, float], 
                                   filename: str = "assessment_report.pdf") -> None:
        """
        Create a comprehensive multi-page PDF report.
        
        Args:
            category_scores: Dict mapping category names to percentage scores (0-100)
            filename: Output PDF filename
        """
        overall_score = np.mean(list(category_scores.values()))
        level = self.get_assessment_level(overall_score)
        
        with PdfPages(filename) as pdf:
            # Page 1: Main report with recommendations and chart
            self._create_main_page(category_scores, overall_score, level, pdf)
            
        print(f"✓ Comprehensive report generated: {filename}")
        print(f"✓ Overall Score: {int(overall_score)}/100")
        print(f"✓ Assessment Level: {level['name']}")
    
    def _create_main_page(self, category_scores: Dict[str, float], 
                         overall_score: float, level: Dict, pdf: PdfPages) -> None:
        """Create the main report page"""
        # Use A4 size: 8.27 x 11.69 inches
        fig = plt.figure(figsize=(8.27, 11.69), facecolor='white')
        
        # Create layout
        ax = fig.add_subplot(111)
        ax.axis('off')
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        
        y_pos = 0.94
        
        # Header
        ax.text(0.05, y_pos, 'AI Readiness Report', 
               fontsize=26, fontweight='600', color='#1a1a1a')
        
        # Valorant logo placeholder (text)
        ax.text(0.95, y_pos, 'valorant', 
               fontsize=10, color='#00A1A1', ha='right',
               style='italic', fontweight='500')
        
        # Separator line
        y_pos -= 0.035
        ax.plot([0.05, 0.95], [y_pos, y_pos], color='#e0e0e0', linewidth=1)
        
        y_pos -= 0.045
        
        # Intro text
        intro_text = level['intro_text']
        if level['next_level']:
            full_text = f"{intro_text} You can progress to the {level['next_level']} level within {level['timeline']}."
        else:
            full_text = f"{intro_text}"
        
        # Use textwrap for proper line wrapping (adjusted for A4 width with margins)
        wrapped_lines = textwrap.fill(full_text, width=85).split('\n')
        
        for line in wrapped_lines:
            # Render text with highlighting for key phrases
            if 'quick wins and build momentum' in line:
                # Render in parts to highlight the phrase
                before = line.split('quick wins and build momentum')[0]
                after = line.split('quick wins and build momentum')[1] if len(line.split('quick wins and build momentum')) > 1 else ''
                
                # Render before text
                t1 = ax.text(0.05, y_pos, before, fontsize=10, color='#1a1a1a', 
                            transform=ax.transAxes, va='top')
                # Get width of before text
                fig.canvas.draw()
                bbox1 = t1.get_window_extent(renderer=fig.canvas.get_renderer())
                bbox1_data = bbox1.transformed(ax.transAxes.inverted())
                
                # Render highlighted text
                t2 = ax.text(bbox1_data.x1, y_pos, 'quick wins and build momentum', 
                            fontsize=10, color='#00A1A1', fontweight='600',
                            transform=ax.transAxes, va='top')
                
                # Get width of highlighted text
                bbox2 = t2.get_window_extent(renderer=fig.canvas.get_renderer())
                bbox2_data = bbox2.transformed(ax.transAxes.inverted())
                
                # Render after text
                ax.text(bbox2_data.x1, y_pos, after, fontsize=10, color='#1a1a1a',
                       transform=ax.transAxes, va='top')
                       
            elif level['timeline'] in line and level['next_level']:
                # Render timeline with highlighting
                before = line.split(level['timeline'])[0]
                after = line.split(level['timeline'])[1] if len(line.split(level['timeline'])) > 1 else ''
                
                t1 = ax.text(0.05, y_pos, before, fontsize=10, color='#1a1a1a',
                            transform=ax.transAxes, va='top')
                fig.canvas.draw()
                bbox1 = t1.get_window_extent(renderer=fig.canvas.get_renderer())
                bbox1_data = bbox1.transformed(ax.transAxes.inverted())
                
                t2 = ax.text(bbox1_data.x1, y_pos, level['timeline'], 
                            fontsize=10, color='#00A1A1', fontweight='600',
                            transform=ax.transAxes, va='top')
                
                bbox2 = t2.get_window_extent(renderer=fig.canvas.get_renderer())
                bbox2_data = bbox2.transformed(ax.transAxes.inverted())
                
                ax.text(bbox2_data.x1, y_pos, after, fontsize=10, color='#1a1a1a',
                       transform=ax.transAxes, va='top')
            else:
                ax.text(0.05, y_pos, line, fontsize=10, color='#1a1a1a',
                       transform=ax.transAxes, va='top')
            
            y_pos -= 0.025
        
        y_pos -= 0.015
        
        # "What you should focus on" section
        ax.text(
            0.05,
            y_pos,
            'What you should focus on',
            fontsize=10,
            color='#00A1A1',
            fontfamily='Geist',
            fontweight='400',
            linespacing=1.4,
            fontstyle='normal',
        )
        y_pos -= 0.02
        ax.text(0.05, y_pos, level['focus_title'], 
               fontsize=10, color='#1a1a1a', fontweight='400')
        y_pos -= 0.035
        
        # Focus areas boxes (adjusted to fit within page)
        box_width = 0.26
        box_height = 0.085
        box_spacing = 0.03
        x_start = 0.05
        
        for i, focus in enumerate(level['focus_areas']):
            x = x_start + i * (box_width + box_spacing)
            
            # Draw box
            rect = FancyBboxPatch((x, y_pos - box_height), box_width, box_height,
                                 boxstyle="round,pad=0.01", 
                                 facecolor='#f5f5f5', edgecolor='#e0e0e0',
                                 linewidth=1)
            ax.add_patch(rect)
            
            # Add icon placeholder (arrow-like symbol)
            ax.text(x + 0.02, y_pos - 0.03, '↗', 
                   fontsize=16, color='#666666')
            
            # Add text
            ax.text(x + 0.02, y_pos - 0.06, focus, 
                   fontsize=8, color='#1a1a1a', fontfamily='monospace',
                   verticalalignment='top')
        
        y_pos -= box_height + 0.035
        
        # "What you should prioritise" section
        ax.text(
            0.05,
            y_pos,
            'What you should prioritise',
            fontsize=10,
            color='#00A1A1',
            fontfamily='Geist',
            fontweight='400',
            fontstyle='normal',
            linespacing=1.4,
        )
        y_pos -= 0.02
        ax.text(0.05, y_pos, level['prioritise_title'], 
               fontsize=10, color='#1a1a1a', fontweight='400')
        y_pos -= 0.035
        
        # Priority boxes
        for i, priority in enumerate(level['priorities']):
            x = x_start + i * (box_width + box_spacing)
            
            # Draw box
            rect = FancyBboxPatch((x, y_pos - box_height), box_width, box_height,
                                 boxstyle="round,pad=0.01", 
                                 facecolor='#f5f5f5', edgecolor='#e0e0e0',
                                 linewidth=1)
            ax.add_patch(rect)
            
            # Add icon placeholder
            ax.text(x + 0.02, y_pos - 0.03, '↗', 
                   fontsize=16, color='#666666')
            
            # Add text
            ax.text(x + 0.02, y_pos - 0.06, priority, 
                   fontsize=8, color='#1a1a1a', fontfamily='monospace',
                   verticalalignment='top')
        
        y_pos -= box_height + 0.035
        
        # Add spider chart (adjusted position and size to fit on page)
        # rect = [left, bottom, width, height] in figure coordinates (0-1)
        self._add_spider_chart_to_axes(category_scores, fig, 
                                       rect=[0.12, 0.05, 0.76, 0.32])
        
        pdf.savefig(fig, bbox_inches='tight', dpi=300)
        plt.close()
    
    def _add_spider_chart_to_axes(self, category_scores: Dict[str, float], 
                                  fig, rect: List[float]) -> None:
        """Add spider chart to the figure"""
        ax = fig.add_axes(rect, projection='polar', facecolor='none')
        
        # Get categories in the correct order
        categories = [
            "Foundation & Infrastructure",
            "Process & Operations",
            "Strategy & Leadership",
            "Governance & Compliance",
            "Talent & Capabilities",
            "Measurement & Investment"
        ]
        
        # Get scores in the same order
        scores = [category_scores.get(cat, 0) for cat in categories]
        
        # Number of variables
        N = len(categories)
        
        # Compute angle for each axis
        angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
        
        # Complete the circle
        scores += scores[:1]
        angles += angles[:1]
        
        # Set up the polar plot
        ax.set_theta_offset(np.pi / 2)
        ax.set_theta_direction(-1)
        
        # Draw the gridlines
        ax.set_ylim(0, 100)
        ax.set_yticks([20, 40, 60, 80, 100])
        ax.set_yticklabels([])  # Hide the radial labels
        
        # Draw axis lines
        ax.set_xticks(angles[:-1])
        
        # Format category labels
        short_labels = [
            "FOUNDATION &\nINFRASTRUCTURE",
            "PROCESS &\nOPERATIONS",
            "STRATEGY &\nLEADERSHIP",
            "GOVERNANCE &\nCOMPLIANCE",
            "TALENT &\nCAPABILITIES",
            "MEASUREMENT &\nINVESTMENT"
        ]
        
        ax.set_xticklabels(short_labels, fontsize=7, color='#1a1a1a')
        ax.spines['polar'].set_visible(False)
        
        # Plot the data with specified colors
        # fill: rgba(13, 190, 190, 0.30) = #0DBEBE with 30% opacity
        ax.fill(angles, scores, color='#0DBEBE', alpha=0.30)
        # stroke: #0DBEBE with stroke-width (adjusted for visibility in PDF)
        ax.plot(angles, scores, color='#0DBEBE', linewidth=1.5)
        
        # Draw grid after fill so it's visible through the transparent area
        ax.grid(True, color='#d0d0d0', linestyle='-', linewidth=0.3, alpha=0.8)
        # ax.scatter(angles[:-1], scores[:-1], color='#008585', s=50, zorder=5)
    
    def create_spider_chart(self, category_scores: Dict[str, float], 
                           filename: str = "assessment_report.pdf",
                           title: str = "AI Readiness Assessment") -> None:
        """
        Create a simple spider/radar chart PDF (for backward compatibility).
        
        Args:
            category_scores: Dict mapping category names to percentage scores (0-100)
            filename: Output PDF filename
            title: Chart title
        """
        fig = plt.figure(figsize=(10, 10), facecolor='white')
        ax = fig.add_subplot(111, projection='polar', facecolor='none')
        
        categories = [
            "Foundation & Infrastructure",
            "Process & Operations",
            "Strategy & Leadership",
            "Governance & Compliance",
            "Talent & Capabilities",
            "Measurement & Investment"
        ]
        
        scores = [category_scores.get(cat, 0) for cat in categories]
        N = len(categories)
        angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
        
        scores += scores[:1]
        angles += angles[:1]
        
        ax.set_theta_offset(np.pi / 2)
        ax.set_theta_direction(-1)
        ax.set_ylim(0, 100)
        ax.set_yticks([20, 40, 60, 80, 100])
        ax.set_yticklabels([])  # Hide the radial labels
        
        ax.set_xticks(angles[:-1])
        category_labels = []
        for cat in categories:
            if len(cat) > 20:
                words = cat.split(' ')
                mid = len(words) // 2
                label = ' '.join(words[:mid]) + '\n' + ' '.join(words[mid:])
            else:
                label = cat
            category_labels.append(label)
        
        ax.set_xticklabels(category_labels, fontsize=11, fontweight='500', color='#1a1a1a')
        ax.spines['polar'].set_visible(False)
        
        # Use specified colors
        ax.fill(angles, scores, color='#0DBEBE', alpha=0.30)
        ax.plot(angles, scores, color='#0DBEBE', linewidth=0.5, linestyle='solid')
        
        # Draw grid after fill so it's visible through the transparent area
        ax.grid(True, color='#d0d0d0', linestyle='-', linewidth=0.3, alpha=0.8)
        # ax.scatter(angles[:-1], scores[:-1], color='#008585', s=80, zorder=5)
        
        # Remove individual score labels for cleaner look
        # for angle, score in zip(angles[:-1], scores[:-1]):
        #     label_distance = score + 8
        #     x = angle
        #     y = label_distance
        #     ax.plot(x, y, 'o', color='white', markersize=12, zorder=4)
        #     ax.text(x, y, f'{int(score)}%', 
        #            ha='center', va='center',
        #            fontsize=9, fontweight='bold', 
        #            color='#0DBEBE', zorder=6)
        
        plt.title(title, size=18, fontweight='600', color='#1a1a1a', 
                 pad=30, loc='center')
        
        overall_score = np.mean(scores[:-1])
        ax.text(0, 0, f'{int(overall_score)}', 
               ha='center', va='center',
               fontsize=48, fontweight='700', 
               color='#0DBEBE', zorder=10)
        ax.text(0, -12, 'Overall Score', 
               ha='center', va='center',
               fontsize=11, fontweight='400', 
               color='#666666', zorder=10)
        
        plt.tight_layout()
        
        with PdfPages(filename) as pdf:
            pdf.savefig(fig, bbox_inches='tight', dpi=300)
            d = pdf.infodict()
            d['Title'] = 'AI Readiness Assessment Report'
            d['Author'] = 'Valorant'
            d['Subject'] = 'Assessment Results'
            d['Keywords'] = 'AI, Readiness, Assessment, Procurement, Supply Chain'
        
        plt.close()
        print(f"✓ Report generated successfully: {filename}")
        print(f"✓ Overall Score: {int(overall_score)}/100")


def create_sample_report():
    """Create a sample comprehensive report with test data"""
    
    sample_answers = {
        1: 75, 2: 75, 3: 75, 4: 75, 5: 75, 6: 75, 7: 75,
        8: 75, 9: 75, 10: 75, 11: 75, 12: 75, 13: 75, 14: 75, 15: 75
    }
    
    generator = AssessmentReportGenerator()
    category_scores = generator.calculate_category_scores(sample_answers)
    
    print("\n=== Category Scores ===")
    for category, score in category_scores.items():
        print(f"{category}: {score:.1f}%")
    
    generator.create_comprehensive_report(
        category_scores,
        filename="ai_readiness_report.pdf"
    )
    
    return category_scores


def load_answers_from_json(json_file: str) -> Dict[int, int]:
    """Load answers from a JSON file"""
    with open(json_file, 'r') as f:
        data = json.load(f)
    return {int(k): int(v) for k, v in data.items()}


def main():
    """Main function to generate reports"""
    import sys
    
    if len(sys.argv) > 1:
        json_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else "ai_readiness_report.pdf"
        
        print(f"Loading answers from {json_file}...")
        answers = load_answers_from_json(json_file)
        
        generator = AssessmentReportGenerator()
        category_scores = generator.calculate_category_scores(answers)
        
        print("\n=== Category Scores ===")
        for category, score in category_scores.items():
            print(f"{category}: {score:.1f}%")
        
        generator.create_comprehensive_report(
            category_scores,
            filename=output_file
        )
    else:
        print("No JSON file provided. Generating sample report...")
        print("Usage: python generate_assessment_report.py [answers.json] [output.pdf]")
        print("\nGenerating sample report with test data...\n")
        create_sample_report()


if __name__ == "__main__":
    main()
