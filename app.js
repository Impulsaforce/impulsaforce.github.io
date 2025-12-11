// Configuración de Marked (para Markdown)
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

// Función principal de inicialización
async function init() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        renderLayout(data.profile); // Header y Footer común

        initThemeToggle();

        // Router muy básico
        const path = window.location.pathname;
        if (path.includes('blog.html')) {
            renderBlog(data.blog);
        } else {
            // Asumimos que si no es blog, es home
            renderPortfolio(data);
        }
        
        initAnimations();

    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

// --- Lógica del Dark Mode ---
// --- Lógica del Dark Mode (Versión Botón) ---
function initThemeToggle() {
    // Usamos el ID del botón ahora
    const toggleButton = document.getElementById('theme-toggle'); 
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const html = document.documentElement;

    // A. Inicializar tema: Leer LocalStorage o usar preferencia del sistema
    let currentTheme = localStorage.getItem('theme');
    
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // B. Aplicar el tema inicial y alternar iconos
    function applyTheme(theme) {
        if (theme === 'dark') {
            html.classList.add('dark');
            // Oculta el Sol (opacidad 0), Muestra la Luna (quita opacidad 0)
            sunIcon.classList.add('opacity-0');
            moonIcon.classList.remove('opacity-0');
        } else {
            html.classList.remove('dark');
            // Muestra el Sol, Oculta la Luna
            sunIcon.classList.remove('opacity-0');
            moonIcon.classList.add('opacity-0');
        }
        localStorage.setItem('theme', theme);
    }
    
    // Aplicamos el tema inicial al cargar
    applyTheme(currentTheme);

    // C. Escuchar CLIC en el botón para alternar tema
    toggleButton.addEventListener('click', () => {
        const isDark = html.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

// 1. Renderizado del Layout (Nav y Footer)
function renderLayout(profile) {
    const headerHTML = `
        <nav class="fixed w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:shadow-xl transition-colors duration-500">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    
                    <div class="flex-shrink-0 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform">
                         <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div>
                         <span class="font-bold text-xl text-gray-800 dark:text-white tracking-tight">Alex<span class="text-blue-600">Architect</span></span>
                    </div>
                    
                    <div class="hidden md:flex flex-grow justify-center">
                        <div class="flex space-x-10">
                            <a href="index.html" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">Portfolio</a>
                            <a href="blog.html" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">Blog</a>
                            <a href="#contact" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">Contactar</a>
                        </div>
                    </div>
                    
                    <div class="flex items-center">
                        <button id="theme-toggle" aria-label="Toggle Dark Mode" 
                                class="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 relative"> 
                                <svg id="sun-icon" class="w-6 h-6 text-yellow-500 transition-opacity duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zm7.65 8.25a.75.75 0 01.75.75.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V18.75a.75.75 0 01.75-.75zM4.35 11.25a.75.75 0 01.75.75.75.75 0 01-.75.75H2.1a.75.75 0 010-1.5h2.25zM17.5 6.47A.75.75 0 0117.5 7L16 8.5V7.75a.75.75 0 011.5 0zM6.5 17.5a.75.75 0 01.75-.75.75.75 0 01.75.75L7.97 19.5a.75.75 0 01-1.06 0L5.5 18.03a.75.75 0 01.97-.97zM6.47 6.5a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0V7.25a.75.75 0 00-.75-.75zM19.5 16.03a.75.75 0 00-.97-.97L16.03 17.5a.75.75 0 001.06 1.06l1.06-1.06a.75.75 0 001.06-1.06zM12 15a3 3 0 100-6 3 3 0 000 6z"></path></svg>
                            
                            <svg id="moon-icon" class="w-6 h-6 text-indigo-400 transition-opacity duration-300 absolute inset-0 m-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M9.332 3.664a1 1 0 001.12.392A14.288 14.288 0 0118 12.25c0 3.79-1.53 7.394-4.28 10.144a15.77 15.77 0 01-10.144 4.28A14.288 14.288 0 013.75 18c0-3.79 1.53-7.394 4.28-10.144a15.77 15.77 0 0110.144-4.28z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;

    const footerHTML = `
        <footer class="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-20 transition-colors duration-500">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-gray-400">© ${new Date().getFullYear()} ${profile.name}. Salesforce Architecture.</p>
            </div>
        </footer>
    `;

    document.getElementById('app-header').innerHTML = headerHTML;
    document.getElementById('app-footer').innerHTML = footerHTML;
}

// 2. Renderizado del Portfolio
function renderPortfolio(data) {
    const container = document.getElementById('main-content');

    // --- GENERADORES DE HTML ---
    
    // 1. Logos Clientes
    const clientsHTML = data.clients.map(c => `
        <div class="flex-shrink-0 mx-8 text-xl font-bold text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default select-none">
            ${c}
        </div>
    `).join('');

    // 2. Stack Tecnológico (AHORA CON LOGO Y COLOR PERSONALIZADO)
    const stackHTML = data.stack.map(s => `
        <span class="inline-flex items-center gap-3 px-5 py-2 ${s.color} rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md hover:scale-[1.02] cursor-default">
            <img src="${s.logo}" alt="${s.name} logo" class="w-4 h-4 object-contain flex-shrink-0">
            ${s.name}
        </span>
    `).join('');

    // 3. Certificaciones (Carrusel vertical con Logo y Link)
    const certsHTML = data.certifications.map(c => `
        <a href="${c.link}" target="_blank" rel="noopener noreferrer" 
           class="block bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-600 hover:translate-x-2 transition-all duration-300 group">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-lg p-1 flex items-center justify-center border border-gray-50 dark:border-gray-600 group-hover:bg-blue-50 transition-colors">
                    <img src="${c.logo}" alt="${c.name}" class="max-w-full max-h-full object-contain overflow-hidden rounded">
                </div>
                <div class="flex-grow">
                    <p class="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight group-hover:text-blue-600 transition-colors">${c.name}</p>
                    <span class="text-[10px] text-blue-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                        Ver Credencial 
                        <svg class="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                </div>
            </div>
        </a>
    `).join('');

    // 4. Experiencia
    const expHTML = data.experience.map(e => `
        <div class="relative pl-8 pb-10 border-l-2 border-blue-100 dark:border-blue-700 last:border-0 hover:border-blue-300 dark:hover:border-blue-500 transition-colors group">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-gray-800 shadow-sm group-hover:scale-125 transition-transform"></div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">${e.role}</h3>
            <p class="text-blue-600 font-medium mb-2">${e.company} | ${e.year}</p>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${e.desc}</p>
        </div>
    `).join('');

    // --- RENDERIZADO PRINCIPAL ---
    
    // Extraemos las métricas para usarlas individualmente en el diseño
    const m1 = data.profile.metrics[0]; // Ej: Años
    const m2 = data.profile.metrics[1]; // Ej: Certificaciones
    const m3 = data.profile.metrics[2]; // Ej: Proyectos

    container.innerHTML = `
        <section class="min-h-screen flex items-center pt-24 pb-12 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden transition-colors duration-500">
                <div class="absolute top-0 right-0 w-2/3 h-full bg-blue-100/80 dark:bg-blue-900/60 rounded-l-[150px] -z-10 translate-x-32 skew-x-[-10deg] transition-colors duration-500"></div>            
                <div class="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-16 items-center">
                <div class="space-y-8 animate-fade-in-up z-10 order-2 lg:order-1">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 font-bold tracking-wider uppercase transition-colors">
                        <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                        Open to Work
                    </div>
                    
                    <h1 class="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] transition-colors">
                        ${data.profile.heroTitle.split(' ').slice(0,2).join(' ')} <br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            ${data.profile.heroTitle.split(' ').slice(2).join(' ')}
                        </span>
                    </h1>
                    
                    <p class="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed border-l-4 border-blue-200 dark:border-blue-700 pl-4 transition-colors">
                        ${data.profile.heroSubtitle}
                    </p>

                    <div class="flex flex-wrap gap-4 pt-2">
                        <a href="#contact" class="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                            Contactar
                        </a>
                        <a href="#stack" class="px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 transition-all">
                            Ver Stack
                        </a>
                    </div>
                </div>

                <div class="relative order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in-delayed">
                    <div class="relative w-[350px] md:w-[450px] aspect-[4/5] min-w-64"> 
                        
                        <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800" 
                            alt="Profile" 
                            class="w-full h-full object-cover rounded-[2rem] shadow-2xl z-10 relative transition-opacity duration-700">
                        
                        <div class="absolute -top-6 -left-8 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 dark:border-gray-700/50 animate-float-slow max-w-[160px] transition-colors duration-500">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none">${m1.value}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase mt-1">${m1.label}</p>
                                </div>
                            </div>
                        </div>

                        <div class="absolute -bottom-8 -right-4 z-30 bg-gray-900 text-white p-5 rounded-2xl shadow-2xl animate-float-medium max-w-[180px]">
                            <p class="text-3xl font-bold text-blue-400 mb-1">${m2.value}</p>
                            <p class="text-sm text-gray-300 leading-tight">${m2.label} Oficiales Salesforce</p>
                        </div>

                        <div class="absolute top-12 -right-10 z-20 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl animate-float-fast border border-gray-100 dark:border-gray-700 hidden md:block transform rotate-3 transition-colors duration-500">
                            <div class="text-center">
                                <p class="text-2xl font-bold text-indigo-600">${m3.value}</p>
                                <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">${m3.label}</p>
                            </div>
                        </div>

                        <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl -z-10"></div>
                        <div class="absolute top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-12 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-500">
             <div class="flex animate-marquee whitespace-nowrap items-center">
                ${clientsHTML} ${clientsHTML} ${clientsHTML}
             </div>
        </section>

        <section id="stack" class="py-24 max-w-7xl mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-20">
                
                <div>
                    
                    <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3 transition-colors">
                        <span class="w-8 h-1 bg-blue-600 rounded-full"></span> Tech Stack
                    </h2>
                    <div class="flex flex-wrap gap-3 mb-20">
                        ${stackHTML}
                    </div>
                    
                    <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3 transition-colors">
                        <span class="w-8 h-1 bg-blue-600 rounded-full"></span> Certificaciones
                    </h2>
                    <div class="mb-16">
                        <div class="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-2xl h-[400px] overflow-hidden relative border border-gray-100 dark:border-gray-700 shadow-inner transition-colors">
                            
                            <div class="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gray-50/50 dark:from-gray-800/50 to-transparent z-10 pointer-events-none transition-colors"></div>
                            <div class="animate-vertical-scroll space-y-4 py-2">
                                ${certsHTML}
                                ${certsHTML} 
                            </div>
                            <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-50/50 dark:from-gray-800/50 to-transparent z-10 pointer-events-none transition-colors"></div>
                        </div>
                    </div>
                </div>

                <div class="relative">
                    <div class="sticky top-24">
                        <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3 transition-colors">
                             <span class="w-8 h-1 bg-indigo-600 rounded-full"></span> Experiencia Laboral
                        </h2>
                        <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
                            <div class="space-y-0">
                                ${expHTML}
                            </div>
                        </div>
                         </div>
                </div>
            </div>
        </section>

        <section id="contact" class="py-24 bg-gray-900 text-white relative overflow-hidden rounded-t-[3rem] mt-10">
            <div class="max-w-3xl mx-auto px-4 relative z-10 text-center">
                <h2 class="text-4xl font-bold mb-6">Let's build something scalable.</h2>
                <form class="space-y-4 text-left bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                    <div class="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nombre" class="w-full bg-gray-700/50 dark:bg-gray-800/50 border border-gray-700 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all outline-none">
                        <input type="email" placeholder="Email" class="w-full bg-gray-700/50 dark:bg-gray-800/50 border border-gray-700 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all outline-none">
                    </div>
                    <textarea rows="4" placeholder="¿En qué puedo ayudarte?" class="w-full bg-gray-700/50 dark:bg-gray-800/50 border border-gray-700 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all outline-none"></textarea>
                    </form>
            </div>
        </section>
    `;
}

// 3. Renderizado del Blog (Markdown)
function renderBlog(posts) {
    const container = document.getElementById('main-content');
    
    // Primero listamos, luego mostramos detalle (Simplificado a lista expandida para este ejemplo)
    const postsHTML = posts.map(post => `
        <article class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12 transition-all hover:shadow-xl">
            <div class="p-8 md:p-12">
                <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Salesforce</span>
                    <span>${post.date}</span>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 mb-6">${post.title}</h2>
                <div class="prose prose-blue prose-lg text-gray-600 max-w-none">
                    ${marked.parse(post.content)}
                </div>
            </div>
        </article>
    `).join('');

    container.innerHTML = `
        <div class="bg-gray-50 min-h-screen pt-32 pb-20">
            <div class="max-w-4xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h1 class="text-4xl font-bold text-gray-900">Blog de Arquitectura</h1>
                    <p class="text-gray-500 mt-4">Pensamientos sobre código, nubes y escalabilidad.</p>
                </div>
                ${postsHTML}
            </div>
        </div>
    `;
}

// Utilidades de Animación
function initAnimations() {
    // Intersection Observer para fade-in al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(sec => {
        sec.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10'); // Estado inicial
        observer.observe(sec);
    });
}

// Ejecutar
init();