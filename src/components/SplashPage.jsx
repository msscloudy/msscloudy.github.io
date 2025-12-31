import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    createTheme,
    ThemeProvider,
    CssBaseline,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Brightness4 as MoonIcon,
    Brightness7 as SunIcon
} from '@mui/icons-material';
import './SplashPage.css';

// Helper component for reveal-on-scroll
const RevealOnScroll = ({ children, delay = 0, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${className} ${isVisible ? 'animate-entry' : 'opacity-0'}`}
            style={{
                animationDelay: `${delay}s`,
                width: '100%'
            }}
        >
            {children}
        </div>
    );
};

const SplashPage = () => {
    const [mode, setMode] = useState(() => { // Renamed isDarkMode to mode
        const saved = localStorage.getItem('theme');
        return saved === 'dark' ? 'dark' : 'light'; // Simplified initialization
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Availability',
        message: ''
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', mode); // Used mode
        localStorage.setItem('theme', mode); // Used mode
    }, [mode]); // Dependency changed to mode

    const theme = useMemo(() => createTheme({
        palette: {
            mode: mode, // Used mode
            primary: {
                main: '#c49b8d', // Soft Copper
            },
            background: {
                paper: mode === 'dark' ? 'rgba(28, 25, 23, 0.85)' : 'rgba(253, 251, 247, 0.95)', // Used mode
            },
            text: {
                primary: mode === 'dark' ? '#fafaf9' : '#292524', // Used mode
                secondary: mode === 'dark' ? '#78716c' : '#57534e', // Used mode
            },
        },
        typography: {
            fontFamily: '"Outfit", sans-serif',
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        marginBottom: '1.25rem',
                        '& .MuiInputBase-root': {
                            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', // Used mode
                            borderRadius: '12px',
                        },
                        '& .MuiInputBase-root:before': {
                            borderBottom: 'none !important'
                        }
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '12px',
                        padding: '14px 24px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: mode === 'dark' ? '0 4px 15px rgba(196, 155, 141, 0.2)' : '0 4px 15px rgba(196, 155, 141, 0.3)', // Used mode
                        }
                    },
                },
            },
        },
    }), [mode]); // Dependency changed to mode

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const mailtoLink = `mailto:contact@jjmlproperty.com?subject=${encodeURIComponent(
            `Inquiry: ${formData.subject}`
        )}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        window.location.href = mailtoLink;
    };

    // Removed toggleTheme function as it's now handled inline in the drawer

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Theme Toggle Button */}
            <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
                <div
                    className="theme-toggle-floating"
                    onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                >
                    <IconButton color="inherit" size="small">
                        {mode === 'light' ? <MoonIcon /> : <SunIcon />}
                    </IconButton>
                </div>
            </Tooltip>

            <div className="splash-container">
                {/* Removed old theme toggle IconButton */}

                {/* Hero Section */}
                <section className="hero-wrapper">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <RevealOnScroll className="hero-text">
                            <h1 className="brand-name">JJML Property</h1>
                            <h2 className="tagline">Your Home in Los Angeles</h2>
                            <p className="description">
                                Offering a boutique living experience in the heart of Los Angeles.
                                We focus on providing well-maintained, comfortable, and modern homes with a personal touch that big management companies can't match.
                            </p>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.2} className="form-container">
                            <h3 className="form-title">Get in Touch</h3>
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    variant="filled"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    variant="filled"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <TextField
                                    select
                                    fullWidth
                                    label="I am interested in"
                                    name="subject"
                                    variant="filled"
                                    value={formData.subject}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Availability">Current Availability</MenuItem>
                                    <MenuItem value="Application">Application Process</MenuItem>
                                    <MenuItem value="General">General Inquiry</MenuItem>
                                </TextField>

                                <TextField
                                    fullWidth
                                    label="Message"
                                    name="message"
                                    multiline
                                    rows={4}
                                    variant="filled"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                >
                                    Send Message
                                </Button>
                            </form>
                        </RevealOnScroll>
                    </div>
                </section>

                {/* Features Section */}
                <section className="stats-section">
                    <div className="stats-grid">
                        <RevealOnScroll delay={0.1} className="stat-item">
                            <h3>Local</h3>
                            <p>Prime LA Location</p>
                        </RevealOnScroll>
                        <RevealOnScroll delay={0.2} className="stat-item">
                            <h3>Private</h3>
                            <p>Boutique Living</p>
                        </RevealOnScroll>
                        <RevealOnScroll delay={0.3} className="stat-item">
                            <h3>Direct</h3>
                            <p>Responsive Management</p>
                        </RevealOnScroll>
                        <RevealOnScroll delay={0.4} className="stat-item">
                            <h3>Modern</h3>
                            <p>Updated Interiors</p>
                        </RevealOnScroll>
                    </div>
                </section>

                {/* About Section */}
                <section className="about-section">
                    <div className="about-content">
                        <RevealOnScroll className="about-image">
                            <img src="/assets/interior.png" alt="Detail of modern living" />
                        </RevealOnScroll>
                        <RevealOnScroll delay={0.2} className="about-text">
                            <h2 className="section-title">The JJML Difference</h2>
                            <p>
                                At JJML Property, we aren't a massive corporation; we are your neighbors.
                                We take pride in owning and managing our property with a level of care and attention to detail that ensures you always feel at home.
                            </p>
                            <p>
                                Our goal is simple: to provide a safe, stylish, and comfortable environment for our residents to thrive in the vibrant city of Los Angeles.
                                When you rent with us, you deal directly with the owners, simplifying communication and ensuring your needs are met promptly.
                            </p>
                        </RevealOnScroll>
                    </div>
                </section>

                <footer className="footer">
                    © {new Date().getFullYear()} JJML Property. | Los Angeles, CA | contact@jjmlproperty.com
                </footer>
            </div>
        </ThemeProvider>
    );
};

export default SplashPage;
