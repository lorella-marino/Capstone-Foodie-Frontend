import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { inviaEmail } from "../redux/actions";
import { Button, Container, Form, Row } from "react-bootstrap";

const Contatti = () => {
  const dispatch = useDispatch();
  const { loading, successo, errore } = useSelector((state) => state.contatto);

  const [form, setForm] = useState({ nome: "", email: "", messaggio: "" });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;

    if (!formElement.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const result = await dispatch(inviaEmail(form));

    if (result?.success) {
      setForm({ nome: "", email: "", messaggio: "" });
      setValidated(false);
    }
  };

  useEffect(() => {
    if (successo) {
      const timer = setTimeout(() => {
        dispatch({ type: "RESET_EMAIL" });
      }, 3000); // 3 secondi

      return () => clearTimeout(timer);
    }
  }, [successo, dispatch]);

  return (
    <Container className="text-center" id="contatti">
      <h2>Hai qualche domanda?</h2>
      <p className="mb-4">Scrivici e ti risponderemo il prima possibile.</p>

      <Form
        id="form"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="form d-flex flex-column align-items-center"
      >
        <Row className="w-50 justify-content-center">
          <Form.Group>
            <Form.Control
              type="text"
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">Inserisci il tuo nome.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">Inserisci una email valida.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Control
              as="textarea"
              name="messaggio"
              placeholder="Messaggio"
              rows={5}
              value={form.messaggio}
              onChange={handleChange}
              required
            />{" "}
            <Form.Control.Feedback type="invalid">Inserisci il messaggio.</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? "Invio..." : "Invia"}
          </Button>
        </Row>
      </Form>

      {successo && <p className="text-success mt-2">Messaggio inviato con successo!</p>}
      {errore && <p className="text-danger mt-2">{errore}</p>}
    </Container>
  );
};

export default Contatti;
