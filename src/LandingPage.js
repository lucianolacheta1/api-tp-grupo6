import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Componente de Landing Page
function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,  // Duración de la animación en milisegundos
    });
  }, []);

  return (
    <div className="container">
      <Header />
      <HowItWorks />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}

// Componente del encabezado
function Header() {
  return (
    <header className="text-center my-5" data-aos="fade-up"> {/* Aparece con un efecto de fade-up */}
      <h1 className="display-1">SplitWise.</h1>

      <p className="lead">
        ¡Gestiona tus gastos compartidos de manera fácil y rápida!
      </p>
      <img 
        src="header-image.jpg" 
        alt="Gastos Compartidos" 
        className="img-fluid mb-3 w-100" 
      />
      <a href="/signup" className="btn btn-primary btn-lg mt-4">Comienza Ahora</a>
    </header>
  );
}

// Sección de "¿Cómo Funciona?"
function HowItWorks() {
  return (
    <section className="my-5" data-aos="fade-up">
      <h2 className="text-center mb-4">¿Cómo Funciona?</h2>
      <div className="row align-items-center mb-5">
        <div className="col-12 col-md-6 text-center">
          <img 
            src="tickets-image.jpg" 
            alt="Sube tus Tickets" 
            className="img-fluid mb-3" 
          />
        </div>
        <div className="col-12 col-md-6">
          <h3>Sube tus Tickets</h3>
          <p>
            Captura una imagen de tus tickets de compra o ingresa los detalles manualmente. 
            Nuestra aplicación te permite registrar la fecha, el monto total, y una descripción de cada gasto.
          </p>
          <a href="/upload-ticket" className="btn btn-outline-dark mt-3">Cargar mi Ticket</a>
        </div>
      </div>

      <div className="row align-items-center" data-aos="fade-up"> {/* Otro fade-up al hacer scroll */}
        <div className="col-12 col-md-6 text-center">
          <h3>Divide y Calcula</h3>
          <p>
            Divide los gastos entre los miembros del grupo de forma equitativa o personaliza la división según las necesidades.
          </p>
          <a href="/signup" className="btn btn-outline-dark mt-3">Registrarme</a>
        </div>
        <div className="col-12 col-md-6 text-center">
          <img 
            src="divide-image.jpg" 
            alt="Divide y Calcula" 
            className="img-fluid mb-3" 
          />
        </div>
      </div>
    </section>
  );
}

// Sección de "¿Por Qué Elegirnos?"
function WhyChooseUs() {
  return (
    <section className="bg-light py-5" data-aos="fade-up">
      <h2 className="text-center mb-4">¿Por Qué Elegirnos?</h2>
      <div className="container">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Fácil de usar</li>
          <li className="list-group-item">Ahorra tiempo</li>
          <li className="list-group-item">Colabora con tu grupo</li>
        </ul>
      </div>
    </section>
  );
}

// Pie de página
function Footer() {
  return (
    <footer className="text-center my-5" data-aos="fade-up">
      <p className="lead">Empieza Ahora Mismo!</p>
      <a href="/signup" className="btn btn-primary btn-lg mt-3">Regístrate</a>
      <p className="mt-3">&copy; SplitWise, 2024</p>
    </footer>
  );
}

export default LandingPage;