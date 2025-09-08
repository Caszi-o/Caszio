const express = require('express');
const Ad = require('../models/Ad');
const Publisher = require('../models/Publisher');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get eligible ads for display (public endpoint)
router.get('/eligible', optionalAuth, async (req, res) => {
  try {
    const {
      slot,
      categories,
      interests,
      deviceType,
      location,
      limit = 10
    } = req.query;

    const criteria = {};
    
    if (categories) {
      criteria.categories = categories.split(',');
    }
    
    if (interests) {
      criteria.interests = interests.split(',');
    }
    
    if (deviceType) {
      criteria.deviceType = deviceType;
    }

    const ads = await Ad.getEligibleAds(criteria);
    
    // Filter by slot if specified
    let filteredAds = ads;
    if (slot) {
      filteredAds = ads.filter(ad => 
        !ad.allowedSlots.length || ad.allowedSlots.includes(slot)
      );
    }

    // Limit results
    const limitedAds = filteredAds.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        ads: limitedAds.map(ad => ({
          _id: ad._id,
          title: ad.title,
          type: ad.type,
          format: ad.format,
          creatives: ad.creatives,
          landingPage: ad.landingPage,
          cta: ad.cta,
          bidding: ad.bidding
        }))
      }
    });

  } catch (error) {
    console.error('Get eligible ads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get eligible ads'
    });
  }
});

// Track ad impression
router.post('/:id/impression', async (req, res) => {
  try {
    const { userAgent, ipAddress, referrer } = req.body;
    
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Record impression
    await ad.recordImpression({
      userAgent,
      ipAddress,
      referrer,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Impression tracked'
    });

  } catch (error) {
    console.error('Track impression error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track impression'
    });
  }
});

// Track ad click
router.post('/:id/click', async (req, res) => {
  try {
    const { userAgent, ipAddress, referrer } = req.body;
    
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Record click
    await ad.recordClick({
      userAgent,
      ipAddress,
      referrer,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Click tracked',
      data: {
        redirectUrl: ad.landingPage.url
      }
    });

  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track click'
    });
  }
});

// Track ad conversion
router.post('/:id/conversion', async (req, res) => {
  try {
    const { value = 0, conversionType = 'generic' } = req.body;
    
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Record conversion
    await ad.recordConversion(value);

    res.json({
      success: true,
      message: 'Conversion tracked'
    });

  } catch (error) {
    console.error('Track conversion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track conversion'
    });
  }
});

// Get ad script for promoters
router.get('/:id/script', async (req, res) => {
  try {
    const { format = 'html', theme = 'default' } = req.query;
    
    const ad = await Ad.findById(req.params.id)
      .populate('publisherId', 'businessName');

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Generate ad script based on format
    let script;
    
    if (format === 'html') {
      script = generateHTMLScript(ad, theme);
    } else if (format === 'javascript') {
      script = generateJavaScriptScript(ad, theme);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid script format'
      });
    }

    res.json({
      success: true,
      data: {
        script,
        format,
        adId: ad._id,
        instructions: getImplementationInstructions(format)
      }
    });

  } catch (error) {
    console.error('Get ad script error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ad script'
    });
  }
});

// Helper functions for script generation
function generateHTMLScript(ad, theme) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return `
<!-- Casyoro Ad: ${ad.title} -->
<div class="casyoro-ad-container" data-ad-id="${ad._id}" style="max-width: ${ad.format.width || 300}px;">
  <div class="casyoro-ad-content" style="
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    font-family: Arial, sans-serif;
  ">
    ${ad.type === 'banner' && ad.creatives[0] ? `
      <img src="${ad.creatives[0].url}" alt="${ad.title}" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 12px;" />
    ` : ''}
    
    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${ad.title}</h3>
    
    ${ad.description ? `
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">${ad.description}</p>
    ` : ''}
    
    <a href="${baseUrl}/api/ads/${ad._id}/click" target="_blank" style="
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
    ">${ad.cta.text || 'Learn More'}</a>
  </div>
</div>

<script>
(function() {
  // Track impression
  fetch('${baseUrl}/api/ads/${ad._id}/impression', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userAgent: navigator.userAgent,
      referrer: document.referrer
    })
  });
})();
</script>
`;
}

function generateJavaScriptScript(ad, theme) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return `
(function() {
  var casyoroAd = {
    id: '${ad._id}',
    title: '${ad.title}',
    description: '${ad.description || ''}',
    cta: '${ad.cta.text || 'Learn More'}',
    landingUrl: '${baseUrl}/api/ads/${ad._id}/click',
    ${ad.creatives[0] ? `imageUrl: '${ad.creatives[0].url}',` : ''}
    
    render: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      
      var adHtml = '<div class="casyoro-ad" style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;background:white;font-family:Arial,sans-serif;">';
      
      ${ad.creatives[0] ? `
      adHtml += '<img src="' + this.imageUrl + '" alt="' + this.title + '" style="width:100%;height:auto;border-radius:4px;margin-bottom:12px;" />';
      ` : ''}
      
      adHtml += '<h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;color:#111827;">' + this.title + '</h3>';
      
      if (this.description) {
        adHtml += '<p style="margin:0 0 12px 0;font-size:14px;color:#6b7280;line-height:1.4;">' + this.description + '</p>';
      }
      
      adHtml += '<a href="' + this.landingUrl + '" target="_blank" style="display:inline-block;background:#3b82f6;color:white;padding:8px 16px;text-decoration:none;border-radius:4px;font-size:14px;font-weight:500;">' + this.cta + '</a>';
      adHtml += '</div>';
      
      container.innerHTML = adHtml;
      
      // Track impression
      this.trackImpression();
    },
    
    trackImpression: function() {
      fetch('${baseUrl}/api/ads/' + this.id + '/impression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      });
    }
  };
  
  // Auto-render if container exists
  document.addEventListener('DOMContentLoaded', function() {
    casyoroAd.render('casyoro-ad-${ad._id}');
  });
  
  // Make available globally
  window.CasyoroAd_${ad._id} = casyoroAd;
})();
`;
}

function getImplementationInstructions(format) {
  if (format === 'html') {
    return {
      title: 'HTML Implementation',
      steps: [
        'Copy the HTML code above',
        'Paste it into your website where you want the ad to appear',
        'The ad will automatically track impressions and clicks',
        'No additional setup required'
      ]
    };
  } else if (format === 'javascript') {
    return {
      title: 'JavaScript Implementation',
      steps: [
        'Add the JavaScript code to your website',
        'Create a div with id="casyoro-ad-{AD_ID}" where you want the ad',
        'The script will automatically render the ad in that container',
        'Alternative: Call CasyoroAd_{AD_ID}.render("your-container-id") manually'
      ]
    };
  }
}

module.exports = router;
