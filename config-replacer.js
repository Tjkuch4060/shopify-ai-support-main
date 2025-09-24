#!/usr/bin/env node

/**
 * Configuration Replacer for AI Support Bot Landing Page
 * 
 * This script replaces template variables in the configurable HTML file
 * with actual values from environment variables or command line arguments.
 * 
 * Usage:
 *   node config-replacer.js [options]
 * 
 * Options:
 *   --input <file>     Input HTML template file (default: DEPLOY-CONFIGURABLE.html)
 *   --output <file>    Output HTML file (default: DEPLOY-READY.html)
 *   --company <name>   Company name
 *   --founder <name>   Founder name
 *   --pixel <id>       Meta Pixel ID
 *   --ga <id>          Google Analytics ID
 *   --calendar <url>   Cal.com calendar URL
 */

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name) => {
    const index = args.indexOf(name);
    return index !== -1 ? args[index + 1] : null;
};

// Configuration with defaults from environment variables
const config = {
    input: getArg('--input') || 'DEPLOY-CONFIGURABLE.html',
    output: getArg('--output') || 'DEPLOY-READY.html',
    companyName: getArg('--company') || process.env.COMPANY_NAME || 'Lumin Agency',
    founderName: getArg('--founder') || process.env.FOUNDER_NAME || 'Tyler Kuchelmeister',
    metaPixelId: getArg('--pixel') || process.env.META_PIXEL_ID || 'YOUR_META_PIXEL_ID_HERE',
    googleAnalyticsId: getArg('--ga') || process.env.GOOGLE_ANALYTICS_ID || 'YOUR_GOOGLE_TAG_ID_HERE',
    calendarUrl: getArg('--calendar') || process.env.CALENDAR_URL || 'https://cal.com/tyler-kuchelmeister-e0drr4'
};

// Generate founder initials for placeholder image
const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

// Replacement mapping
const replacements = {
    // Templated placeholders (DEPLOY-CONFIGURABLE.html)
    '{{COMPANY_NAME}}': config.companyName,
    '{{FOUNDER_NAME}}': config.founderName,
    '{{FOUNDER_NAME_INITIALS}}': getInitials(config.founderName),
    '{{GOOGLE_ANALYTICS_ID}}': config.googleAnalyticsId,
    '{{CALENDAR_URL}}': config.calendarUrl,

    // Plain placeholders used in index.html
    'YOUR_GOOGLE_TAG_ID': config.googleAnalyticsId,

    // Replace base calendar URL wherever it appears (preserves UTM params)
    'https://cal.com/tyler-kuchelmeister-e0drr4': config.calendarUrl,

    // Company branding in static files
    'Lumin Agency': config.companyName
};

try {
    // Read input file
    console.log(`📖 Reading template: ${config.input}`);
    const template = fs.readFileSync(config.input, 'utf8');
    
    // Apply replacements
    console.log('🔄 Applying configuration...');
    let output = template;
    
    Object.entries(replacements).forEach(([placeholder, value]) => {
        output = output.replace(new RegExp(placeholder, 'g'), value);
        console.log(`   ${placeholder} → ${value}`);
    });
    
    // Write output file
    console.log(`💾 Writing configured file: ${config.output}`);
    fs.writeFileSync(config.output, output);
    
    console.log('\n🎉 Configuration complete!');
    console.log(`📁 Deploy-ready file: ${config.output}`);
    console.log('\nNext steps:');
    console.log(`1. Upload ${config.output} to your hosting platform`);
    console.log('2. Test the ROI calculator and lead capture');
    console.log('3. Verify analytics tracking');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}