/* ============================================
   Config-Driven UI — Preset Configurations
   Real-world industry examples
   ============================================ */

const PRESETS = {};

// ─────────────────────────────────────────────
// PRESET 1: Swiggy / Zomato Food Delivery Feed
// ─────────────────────────────────────────────
PRESETS.food_feed = {
  meta: {
    name: "🍕 Food Delivery Feed",
    description: "Swiggy / Zomato style home feed with banners, categories, and restaurant cards"
  },
  schema: {
    type: "page",
    children: [
      {
        type: "banner",
        props: {
          title: "🎉 50% OFF on your first order!",
          subtitle: "Use code WELCOME50 • Valid till midnight",
          gradient: ["#7c5cfc", "#00d4aa"]
        }
      },
      {
        type: "section",
        props: { title: "What's on your mind?" },
        children: [
          {
            type: "row",
            children: [
              { type: "chip", props: { label: "🍕 Pizza", value: "pizza", group: "cuisine" } },
              { type: "chip", props: { label: "🍔 Burgers", value: "burgers", group: "cuisine" } },
              { type: "chip", props: { label: "🍜 Chinese", value: "chinese", group: "cuisine" } },
              { type: "chip", props: { label: "🍱 Thali", value: "thali", group: "cuisine" } },
              { type: "chip", props: { label: "🧁 Desserts", value: "desserts", group: "cuisine" } },
              { type: "chip", props: { label: "☕ Cafe", value: "cafe", group: "cuisine" } },
              { type: "chip", props: { label: "🥗 Healthy", value: "healthy", group: "cuisine" } },
              { type: "chip", props: { label: "🌮 Street Food", value: "street", group: "cuisine" } }
            ]
          }
        ]
      },
      {
        type: "section",
        props: { title: "Top Restaurants Near You", subtitle: "Curated for your cravings" },
        children: [
          {
            type: "grid",
            props: { columns: 2, gap: 12 },
            children: [
              {
                type: "card",
                props: {
                  image: "🍕",
                  title: "Pizza Paradise",
                  description: "Wood-fired pizzas • Italian • Fast Delivery",
                  badges: [
                    { text: "⭐ 4.5", variant: "yellow" },
                    { text: "25 min", variant: "green" }
                  ],
                  footer: {
                    left: "₹200 for two",
                    action: { label: "Order Now", style: "primary", onClick: { type: "toast", message: "🍕 Opening Pizza Paradise menu..." } }
                  }
                }
              },
              {
                type: "card",
                props: {
                  image: "🍔",
                  title: "Burger Barn",
                  description: "Juicy burgers • American • Premium",
                  badges: [
                    { text: "⭐ 4.3", variant: "yellow" },
                    { text: "30 min", variant: "green" },
                    { text: "60% OFF", variant: "red" }
                  ],
                  footer: {
                    left: "₹350 for two",
                    action: { label: "Order Now", style: "primary", onClick: { type: "toast", message: "🍔 Opening Burger Barn menu..." } }
                  }
                }
              },
              {
                type: "card",
                props: {
                  image: "🍜",
                  title: "Dragon Wok",
                  description: "Noodles • Chinese • Szechwan",
                  badges: [
                    { text: "⭐ 4.7", variant: "yellow" },
                    { text: "20 min", variant: "green" }
                  ],
                  footer: {
                    left: "₹300 for two",
                    action: { label: "Order Now", style: "primary", onClick: { type: "toast", message: "🍜 Opening Dragon Wok menu..." } }
                  }
                }
              },
              {
                type: "card",
                props: {
                  image: "🧁",
                  title: "Sweet Tooth Bakery",
                  description: "Cakes • Pastries • Fresh Baked",
                  badges: [
                    { text: "⭐ 4.8", variant: "yellow" },
                    { text: "15 min", variant: "green" },
                    { text: "NEW", variant: "purple" }
                  ],
                  footer: {
                    left: "₹150 for two",
                    action: { label: "Order Now", style: "primary", onClick: { type: "toast", message: "🧁 Opening Sweet Tooth menu..." } }
                  }
                }
              }
            ]
          }
        ]
      },
      {
        type: "alert",
        props: {
          variant: "info",
          icon: "💡",
          title: "Config-Driven Architecture",
          message: "This entire feed is rendered from a JSON schema. Change the JSON on the left to see instant updates!"
        }
      }
    ]
  }
};


// ─────────────────────────────────────────────
// PRESET 2: Smart Dynamic KYC / Onboarding Form
// ─────────────────────────────────────────────
PRESETS.kyc_form = {
  meta: {
    name: "📋 Smart KYC Form",
    description: "Dynamic form with conditional fields — select 'Business' to reveal GST fields"
  },
  schema: {
    type: "page",
    children: [
      {
        type: "banner",
        props: {
          title: "🔐 Complete Your KYC",
          subtitle: "Verify your identity to unlock all features",
          gradient: ["#00d4aa", "#38bdf8"]
        }
      },
      {
        type: "section",
        props: { title: "Personal Information" },
        children: [
          {
            type: "input",
            props: {
              label: "Full Name",
              placeholder: "Enter your full legal name",
              field: "fullName",
              required: true
            }
          },
          {
            type: "input",
            props: {
              label: "Email Address",
              placeholder: "you@example.com",
              field: "email",
              inputType: "email",
              required: true
            }
          },
          {
            type: "input",
            props: {
              label: "Phone Number",
              placeholder: "+91 98765 43210",
              field: "phone",
              inputType: "tel",
              required: true
            }
          }
        ]
      },
      { type: "divider" },
      {
        type: "section",
        props: { title: "Account Type" },
        children: [
          {
            type: "select",
            props: {
              label: "Select Account Type",
              field: "accountType",
              options: [
                { label: "Choose...", value: "" },
                { label: "👤 Personal", value: "personal" },
                { label: "🏢 Business", value: "business" }
              ]
            }
          },
          {
            type: "alert",
            props: {
              variant: "info",
              icon: "👆",
              title: "Try it!",
              message: "Select 'Business' above to see conditional fields appear dynamically — powered by showIf rules in the JSON config."
            }
          }
        ]
      },
      {
        type: "section",
        props: { title: "🏢 Business Details" },
        showIf: { field: "accountType", equals: "business" },
        children: [
          {
            type: "alert",
            props: {
              variant: "success",
              icon: "✅",
              title: "Dynamic Section Revealed!",
              message: "These fields appeared because accountType === 'business'. This is the power of conditional rendering in Config-Driven UI."
            }
          },
          {
            type: "input",
            props: {
              label: "Company Name",
              placeholder: "Enter registered company name",
              field: "companyName",
              required: true
            }
          },
          {
            type: "input",
            props: {
              label: "GSTIN",
              placeholder: "e.g. 22AAAAA0000A1Z5",
              field: "gstin",
              required: true
            }
          },
          {
            type: "input",
            props: {
              label: "Company PAN",
              placeholder: "e.g. ABCDE1234F",
              field: "companyPan",
              required: true
            }
          },
          {
            type: "select",
            props: {
              label: "Business Type",
              field: "businessType",
              options: [
                { label: "Choose...", value: "" },
                { label: "Private Limited", value: "pvt_ltd" },
                { label: "LLP", value: "llp" },
                { label: "Sole Proprietorship", value: "sole_prop" },
                { label: "Partnership", value: "partnership" }
              ]
            }
          }
        ]
      },
      { type: "divider" },
      {
        type: "section",
        props: { title: "Document Upload" },
        children: [
          {
            type: "select",
            props: {
              label: "ID Document Type",
              field: "docType",
              options: [
                { label: "Choose...", value: "" },
                { label: "Aadhaar Card", value: "aadhaar" },
                { label: "PAN Card", value: "pan" },
                { label: "Passport", value: "passport" },
                { label: "Voter ID", value: "voter_id" }
              ]
            }
          },
          {
            type: "input",
            props: {
              label: "Document Number",
              placeholder: "Enter document number",
              field: "docNumber",
              required: true
            }
          }
        ]
      },
      { type: "spacer", props: { height: 8 } },
      {
        type: "button",
        props: {
          label: "✅ Submit KYC",
          style: "primary",
          fullWidth: true,
          onClick: {
            type: "submit",
            message: "📋 KYC form submitted! Check the Event Log below to see all captured state."
          }
        }
      },
      { type: "spacer", props: { height: 4 } },
      {
        type: "button",
        props: {
          label: "🔄 Reset Form",
          style: "secondary",
          fullWidth: true,
          onClick: {
            type: "reset",
            message: "Form has been reset."
          }
        }
      }
    ]
  }
};


// ─────────────────────────────────────────────
// PRESET 3: E-Commerce Product Page
// ─────────────────────────────────────────────
PRESETS.ecommerce = {
  meta: {
    name: "🛒 E-Commerce Product",
    description: "Product showcase with color/size selectors, pricing, and cart actions"
  },
  schema: {
    type: "page",
    children: [
      {
        type: "card",
        props: {
          image: "👟",
          title: "",
          description: ""
        },
        children: [
          {
            type: "heading",
            props: { text: "Nike Air Max 270 React", level: "h2" }
          },
          {
            type: "text",
            props: { content: "Men's Running Shoes — Breathable comfort meets futuristic design", modifier: "muted" }
          },
          { type: "spacer", props: { height: 8 } },
          {
            type: "row",
            children: [
              { type: "badge", props: { text: "⭐ 4.6 (2.3k reviews)", variant: "yellow" } },
              { type: "badge", props: { text: "Free Delivery", variant: "green" } },
              { type: "badge", props: { text: "Top Seller", variant: "purple" } }
            ]
          }
        ]
      },
      {
        type: "section",
        props: { title: "💰 Pricing" },
        children: [
          {
            type: "row",
            children: [
              { type: "heading", props: { text: "₹8,995", level: "h2" } },
              { type: "text", props: { content: "₹14,995", modifier: "strikethrough" } },
              { type: "badge", props: { text: "40% OFF", variant: "red" } }
            ]
          },
          {
            type: "text",
            props: { content: "Inclusive of all taxes. EMI starts at ₹1,499/month", modifier: "small" }
          }
        ]
      },
      {
        type: "section",
        props: { title: "🎨 Select Color" },
        children: [
          {
            type: "chip-group",
            props: {
              field: "selectedColor",
              chips: [
                { label: "⚫ Black", value: "black" },
                { label: "⚪ White", value: "white" },
                { label: "🔵 Navy Blue", value: "navy" },
                { label: "🔴 Crimson", value: "crimson" }
              ]
            }
          }
        ]
      },
      {
        type: "section",
        props: { title: "📏 Select Size" },
        children: [
          {
            type: "chip-group",
            props: {
              field: "selectedSize",
              chips: [
                { label: "UK 6", value: "6" },
                { label: "UK 7", value: "7" },
                { label: "UK 8", value: "8" },
                { label: "UK 9", value: "9" },
                { label: "UK 10", value: "10" },
                { label: "UK 11", value: "11" }
              ]
            }
          }
        ]
      },
      { type: "divider" },
      {
        type: "section",
        props: { title: "📦 Delivery" },
        children: [
          {
            type: "input",
            props: {
              label: "Check Delivery to Pincode",
              placeholder: "Enter 6-digit pincode",
              field: "pincode"
            }
          },
          {
            type: "alert",
            props: {
              variant: "success",
              icon: "🚚",
              title: "Delivering to most areas",
              message: "Free delivery on orders above ₹999. Usually delivered in 3-5 business days."
            }
          }
        ]
      },
      { type: "spacer", props: { height: 8 } },
      {
        type: "button",
        props: {
          label: "🛒 Add to Cart",
          style: "primary",
          fullWidth: true,
          onClick: {
            type: "submit",
            message: "🛒 Product added to cart! Check the Event Log for selected options."
          }
        }
      },
      { type: "spacer", props: { height: 4 } },
      {
        type: "button",
        props: {
          label: "⚡ Buy Now",
          style: "success",
          fullWidth: true,
          onClick: {
            type: "toast",
            message: "⚡ Redirecting to checkout..."
          }
        }
      },
      { type: "spacer", props: { height: 4 } },
      {
        type: "button",
        props: {
          label: "♡ Add to Wishlist",
          style: "outline",
          fullWidth: true,
          onClick: {
            type: "toast",
            message: "♡ Added to your wishlist!"
          }
        }
      }
    ]
  }
};


// ─────────────────────────────────────────────
// PRESET 4: Analytics Dashboard
// ─────────────────────────────────────────────
PRESETS.dashboard = {
  meta: {
    name: "📊 Analytics Dashboard",
    description: "Metric cards, progress bars, and activity feed"
  },
  schema: {
    type: "page",
    children: [
      {
        type: "banner",
        props: {
          title: "📊 Dashboard Overview",
          subtitle: "Real-time metrics — September 2026",
          gradient: ["#38bdf8", "#7c5cfc"]
        }
      },
      {
        type: "grid",
        props: { columns: 4, gap: 12 },
        children: [
          {
            type: "metric",
            props: {
              icon: "👥",
              value: "24,521",
              label: "Total Users",
              change: { value: "+12.5%", direction: "up" }
            }
          },
          {
            type: "metric",
            props: {
              icon: "💰",
              value: "₹18.2L",
              label: "Revenue",
              change: { value: "+8.3%", direction: "up" }
            }
          },
          {
            type: "metric",
            props: {
              icon: "📦",
              value: "3,847",
              label: "Orders",
              change: { value: "-2.1%", direction: "down" }
            }
          },
          {
            type: "metric",
            props: {
              icon: "⭐",
              value: "4.7",
              label: "Avg Rating",
              change: { value: "+0.3", direction: "up" }
            }
          }
        ]
      },
      {
        type: "section",
        props: { title: "📈 Performance Metrics" },
        children: [
          {
            type: "progress",
            props: { label: "Conversion Rate", value: 72, color: "accent" }
          },
          {
            type: "progress",
            props: { label: "Server Uptime", value: 99.8, color: "green" }
          },
          {
            type: "progress",
            props: { label: "Customer Satisfaction", value: 88, color: "blue" }
          },
          {
            type: "progress",
            props: { label: "Sprint Completion", value: 45, color: "yellow" }
          }
        ]
      },
      {
        type: "section",
        props: { title: "🔔 Recent Activity" },
        children: [
          {
            type: "list",
            children: [
              {
                type: "list-item",
                props: {
                  icon: "💳",
                  iconBg: "purple",
                  title: "Payment received from Rahul Sharma",
                  subtitle: "2 minutes ago",
                  trailing: "+₹2,499"
                }
              },
              {
                type: "list-item",
                props: {
                  icon: "👤",
                  iconBg: "blue",
                  title: "New user registration — Priya Patel",
                  subtitle: "15 minutes ago",
                  trailing: "Active"
                }
              },
              {
                type: "list-item",
                props: {
                  icon: "📦",
                  iconBg: "green",
                  title: "Order #4521 delivered successfully",
                  subtitle: "1 hour ago",
                  trailing: "Completed"
                }
              },
              {
                type: "list-item",
                props: {
                  icon: "⚠️",
                  iconBg: "yellow",
                  title: "Server CPU usage exceeded 85%",
                  subtitle: "3 hours ago",
                  trailing: "Warning"
                }
              },
              {
                type: "list-item",
                props: {
                  icon: "🔄",
                  iconBg: "blue",
                  title: "Database backup completed",
                  subtitle: "6 hours ago",
                  trailing: "Success"
                }
              }
            ]
          }
        ]
      },
      {
        type: "section",
        props: { title: "⚙️ Quick Actions" },
        children: [
          {
            type: "grid",
            props: { columns: 3, gap: 10 },
            children: [
              {
                type: "button",
                props: {
                  label: "📤 Export Report",
                  style: "secondary",
                  fullWidth: true,
                  onClick: { type: "toast", message: "📤 Generating CSV report..." }
                }
              },
              {
                type: "button",
                props: {
                  label: "🔄 Refresh Data",
                  style: "secondary",
                  fullWidth: true,
                  onClick: { type: "toast", message: "🔄 Fetching latest metrics..." }
                }
              },
              {
                type: "button",
                props: {
                  label: "⚙️ Settings",
                  style: "secondary",
                  fullWidth: true,
                  onClick: { type: "toast", message: "⚙️ Opening dashboard settings..." }
                }
              }
            ]
          }
        ]
      }
    ]
  }
};
