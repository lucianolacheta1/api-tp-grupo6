import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

function WhyChooseUs() {
  return (
    <div id="whyChooseUs">
      <section className="bg-light py-5" style={{ borderRadius: '20px' }}>
        <Container>
          <h2 className="text-center mb-4" data-aos="fade-up">
            ¿Por Qué Elegirnos?
          </h2>
          <Row className="group space-x-4">
            <Col md={4} data-aos="fade-up" data-aos-delay="200" className="group">
              <Card className="mb-4 transition-transform duration-300 ease-in-out transform group-hover:scale-90 hover:scale-110 hover:z-10 group-hover:blur-sm hover:blur-none">
                <Card.Body>
                  <Card.Title>Fácil de usar</Card.Title>
                  <Card.Text>
                    Una interfaz intuitiva que te permite gestionar tus gastos sin complicaciones.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} data-aos="fade-up" data-aos-delay="400" className="group">
              <Card className="mb-4 transition-transform duration-300 ease-in-out transform group-hover:scale-90 hover:scale-110 hover:z-10 group-hover:blur-sm hover:blur-none">
                <Card.Body>
                  <Card.Title>Ahorra tiempo</Card.Title>
                  <Card.Text>
                    Automatizamos los cálculos para que puedas centrarte en lo que realmente importa.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} data-aos="fade-up" data-aos-delay="600" className="group">
              <Card className="mb-4 transition-transform duration-300 ease-in-out transform group-hover:scale-90 hover:scale-110 hover:z-10 group-hover:blur-sm hover:blur-none">
                <Card.Body>
                  <Card.Title>Colabora con tu grupo</Card.Title>
                  <Card.Text>
                    Comparte gastos y mantén a todos informados de manera sencilla.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default WhyChooseUs;
