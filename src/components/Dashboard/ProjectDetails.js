import React, { useState, useCallback } from 'react';
import { Button, Modal, Form, ListGroup, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import UploadTicket from '../Dashboard/UploadTicket'; // Importar el componente UploadTicket
import TicketCard from '../Dashboard/TicketCard'; // Importar el componente TicketCard

function ProjectDetails({ project, onBack, onUpdateProject, friends, setFriends }) {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEquallyDivided, setIsEquallyDivided] = useState(true);

  const handleAddExpense = useCallback(
    (values, { resetForm }) => {
      const newExpense = {
        id: Date.now(),
        description: values.description,
        amount: parseFloat(values.amount),
        date: new Date().toLocaleDateString(),
        members: values.members,
        isEquallyDivided: values.isEquallyDivided,
        percentages: values.percentages,
      };

      // Actualizar los gastos del proyecto
      const updatedProject = {
        ...project,
        expenses: [...(project.expenses || []), newExpense],
      };

      onUpdateProject(updatedProject);
      resetForm();
      setShowExpenseModal(false);
    },
    [project, onUpdateProject]
  );

  const handleAddMember = useCallback(() => {
    const newMembers = selectedFriends.filter(friend => 
      !project.members.some(member => member.id === friend.id)
    ).map(friend => ({
      id: friend.id,
      name: friend.name,
    }));

    // Actualizar los miembros del proyecto
    const updatedProject = {
      ...project,
      members: [...(project.members || []), ...newMembers],
    };

    onUpdateProject(updatedProject);
    setShowMemberModal(false);
  }, [project, selectedFriends, onUpdateProject]);

  const handleSelectFriend = (friend) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.find(f => f.id === friend.id)) {
        return prevSelected.filter(f => f.id !== friend.id);
      } else {
        return [...prevSelected, friend];
      }
    });
  };

  const handleUploadTicket = (ticketData) => {
    const updatedProject = {
      ...project,
      tickets: [...(project.tickets || []), ticketData],
      expenses: [
        ...(project.expenses || []),
        ...ticketData.details.map(detail => ({
          id: detail.id, // Asegúrate de que cada detalle tenga un ID único
          description: detail.product,
          amount: detail.amount,
          date: ticketData.date,
          members: [],
          isEquallyDivided: true,
          percentages: [],
        })),
      ],
    };
  
    onUpdateProject(updatedProject);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsEquallyDivided(expense.isEquallyDivided);
    setShowExpenseModal(true);
  };

  const handleSaveExpense = (values) => {
    const updatedExpenses = (project.expenses || []).map(expense =>
      expense.id === values.id ? { ...expense, ...values } : expense
    );

    const updatedProject = {
      ...project,
      expenses: updatedExpenses,
    };

    onUpdateProject(updatedProject);
    setShowExpenseModal(false);
    setEditingExpense(null);
  };


  const handleDeleteExpense = (expenseId) => {
    // Filtrar los gastos para eliminar el gasto seleccionado
    const updatedExpenses = (project.expenses || []).filter(expense => expense.id !== expenseId);
  
    // Actualizar los tickets eliminando el producto correspondiente
    const updatedTickets = (project.tickets || []).map(ticket => ({
      ...ticket,
      details: ticket.details.filter(detail => detail.id !== expenseId),
    })).filter(ticket => ticket.details.length > 0); // Eliminar la TicketCard si se queda sin productos
  
    const updatedProject = {
      ...project,
      expenses: updatedExpenses,
      tickets: updatedTickets,
    };
  
    onUpdateProject(updatedProject);
  };

  const validationSchemaExpense = Yup.object().shape({
    description: Yup.string().required('La descripción es obligatoria'),
    amount: Yup.number()
      .required('El monto es obligatorio')
      .positive('El monto debe ser positivo'),
    members: Yup.array().of(Yup.string().required('Selecciona al menos un miembro')),
    percentages: Yup.array().of(Yup.number().min(0).max(100)),
  });

  // Calcular cuánto debe cada miembro
  const calculateAmounts = () => {
    const memberAmounts = {};
    (project.members || []).forEach(member => {
      memberAmounts[member.id] = 0;
    });

    (project.expenses || []).forEach(expense => {
      if (expense.isEquallyDivided) {
        const amountPerMember = expense.amount / expense.members.length;
        expense.members.forEach(memberId => {
          memberAmounts[memberId] += amountPerMember;
        });
      } else {
        expense.members.forEach((memberId, index) => {
          memberAmounts[memberId] += (expense.amount * (expense.percentages[index] / 100));
        });
      }
    });

    return memberAmounts;
  };

  const memberAmounts = calculateAmounts();

  const totalAmount = (project.expenses || []).reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div>
      <Button variant="link" onClick={onBack}>
        &larr; Volver a Proyectos
      </Button>
      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <h4>Tickets</h4>
      <UploadTicket onUpload={handleUploadTicket} />
      {project.tickets && project.tickets.length > 0 ? (
        <Row xs={1} md={2} className="g-4">
          {project.tickets.map((ticket, index) => (
            <Col key={index}>
              <TicketCard ticket={ticket} />
            </Col>
          ))}
        </Row>
      ) : (
        <p>No hay tickets cargados.</p>
      )}

      <h4 className="mt-4">Gastos</h4>
      {project.expenses && project.expenses.length === 0 ? (
        <p>No hay gastos registrados.</p>
      ) : (
        <ListGroup>
          {(project.expenses || []).map((expense) => (
            <ListGroup.Item key={expense.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{expense.description}</h5>
                  <p>
                    {expense.amount.toFixed(2)} - {expense.date}
                  </p>
                  <p>
                    Miembros: {(expense.members || []).map(memberId => {
                      const member = (project.members || []).find(m => m.id === memberId);
                      return member ? member.name : 'Desconocido';
                    }).join(', ')}
                  </p>
                </div>
                <div>
                  <Button variant="link" onClick={() => handleEditExpense(expense)}>
                    Editar
                  </Button>
                  <Button variant="link" onClick={() => handleDeleteExpense(expense.id)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <h4 className="mt-4">Miembros</h4>
      <Button variant="secondary" className="mb-3" onClick={() => setShowMemberModal(true)}>
        Añadir Miembro
      </Button>
      {project.members && project.members.length === 0 ? (
        <p>No hay miembros en este proyecto.</p>
      ) : (
        <ListGroup>
          {(project.members || []).map((member) => (
            <ListGroup.Item key={member.id}>{member.name}</ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <h4 className="mt-4">Resumen</h4>
      <p>Total gastado: {totalAmount.toFixed(2)}</p>
      <ListGroup>
        {(project.members || []).map(member => (
          <ListGroup.Item key={member.id}>
            {member.name}: {memberAmounts[member.id].toFixed(2)}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal para añadir gasto */}
      <Modal show={showExpenseModal} onHide={() => setShowExpenseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingExpense ? 'Editar Gasto' : 'Añadir Gasto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={editingExpense || { description: '', amount: '', members: [], isEquallyDivided: true, percentages: [] }}
            validationSchema={validationSchemaExpense}
            onSubmit={editingExpense ? handleSaveExpense : handleAddExpense}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="description">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="Descripción del gasto"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && errors.description}
                    disabled={!!editingExpense}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="amount">
                  <Form.Label>Monto</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Monto del gasto"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.amount && errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="members">
                  <Form.Label>Miembros</Form.Label>
                  <FieldArray
                    name="members"
                    render={arrayHelpers => (
                      <div>
                        {(project.members || []).map(member => (
                          <div key={member.id}>
                            <Form.Check
                              type="checkbox"
                              label={member.name}
                              value={member.id}
                              checked={values.members.includes(member.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  if (!values.members.includes(member.id)) {
                                    arrayHelpers.push(member.id);
                                  }
                                } else {
                                  const idx = values.members.indexOf(member.id);
                                  arrayHelpers.remove(idx);
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  {touched.members && errors.members && (
                    <div className="text-danger">{errors.members}</div>
                  )}
                </Form.Group>
                <Form.Group controlId="isEquallyDivided">
                  <Form.Check
                    type="radio"
                    label="Dividir equitativamente"
                    name="isEquallyDivided"
                    checked={values.isEquallyDivided}
                    onChange={() => setFieldValue('isEquallyDivided', true)}
                  />
                  <Form.Check
                    type="radio"
                    label="Dividir por porcentajes"
                    name="isEquallyDivided"
                    checked={!values.isEquallyDivided}
                    onChange={() => setFieldValue('isEquallyDivided', false)}
                  />
                </Form.Group>
                {!values.isEquallyDivided && (
                  <Form.Group controlId="percentages">
                    <Form.Label>Porcentajes</Form.Label>
                    <FieldArray
                      name="percentages"
                      render={arrayHelpers => (
                        <div>
                          {values.members.map((memberId, index) => (
                            <div key={memberId}>
                              <Form.Label>{(project.members || []).find(m => m.id === memberId).name}</Form.Label>
                              <Form.Control
                                type="number"
                                name={`percentages.${index}`}
                                value={values.percentages[index] || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.percentages && errors.percentages && errors.percentages[index]}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.percentages && errors.percentages[index]}
                              </Form.Control.Feedback>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </Form.Group>
                )}
                <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Modal para añadir miembro */}
      <Modal show={showMemberModal} onHide={() => setShowMemberModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Miembro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Selecciona amigos existentes</h5>
          <ListGroup>
            {(friends || []).map((friend) => (
              <ListGroup.Item
                key={friend.id}
                action
                onClick={() => handleSelectFriend(friend)}
                active={selectedFriends.some(f => f.id === friend.id)}
                disabled={(project.members || []).some(member => member.id === friend.id)}
              >
                {friend.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <hr />
          <h5>Añadir nuevo amigo</h5>
          <Formik
            initialValues={{ friendName: '' }}
            validationSchema={Yup.object().shape({
              friendName: Yup.string().required('El nombre del amigo es obligatorio'),
            })}
            onSubmit={(values, { resetForm }) => {
              const newFriend = { id: Date.now(), name: values.friendName };
              setFriends((prevFriends) => [...prevFriends, newFriend]);
              setSelectedFriends((prevSelected) => [...prevSelected, newFriend]);
              resetForm();
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="friendName">
                  <Form.Label>Nombre del Amigo</Form.Label>
                  <Form.Control
                    type="text"
                    name="friendName"
                    placeholder="Ingresa el nombre del amigo"
                    value={values.friendName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.friendName && errors.friendName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.friendName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting} className="mt-3">
                  {isSubmitting ? 'Añadiendo...' : 'Añadir'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMemberModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddMember}>
            Añadir Miembros Seleccionados
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onUpdateProject: PropTypes.func.isRequired,
  friends: PropTypes.array.isRequired,
  setFriends: PropTypes.func.isRequired,
};

export default React.memo(ProjectDetails);