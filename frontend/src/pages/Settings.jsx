// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { 
  Card, 
  Form, 
  Button, 
  Alert, 
  Row, 
  Col, 
  ListGroup, 
  InputGroup 
} from "react-bootstrap";
import { useAppContext } from "../context/AppContext";

export default function Settings() {
  // --- UPDATED to include category functions ---
  const { 
    user, 
    updateUserDetails, 
    changePassword, 
    appError, 
    clearError,
    categories,
    getCategories,
    addCategory,
    deleteCategory
  } = useAppContext();

  // State for forms
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currency: "USD",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newCategory, setNewCategory] = useState(""); // <-- State for new category

  // State for alerts
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [categoryMsg, setCategoryMsg] = useState({ type: "", text: "" }); // <-- Alert for categories

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        currency: user.currency || "USD",
      });
    }
  }, [user]);
  
  // --- ADDED: Fetch categories on load ---
  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
      setProfileMsg({ type: "", text: "" });
      setPasswordMsg({ type: "", text: "" });
      setCategoryMsg({ type: "", text: "" });
    };
  }, [clearError]);


  const onProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const onPasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Profile Submit Handler
  const onProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    clearError();
    try {
      await updateUserDetails(profileForm);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      // appError is set by the context
    }
  };

  // Password Submit Handler
  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });
    clearError();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "danger", text: "New passwords do not match" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ type: "danger", text: "Password must be at least 6 characters" });
      return;
    }

    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      // appError is set by the context
    }
  };

  // --- ADDED: Category Handlers ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryMsg({ type: "", text: "" });
    clearError();
    if (!newCategory) {
      setCategoryMsg({ type: "danger", text: "Please enter a category name" });
      return;
    }
    try {
      await addCategory(newCategory);
      setNewCategory(""); // Clear input
      setCategoryMsg({ type: "success", text: `Category "${newCategory}" added!` });
    } catch (err) {
      setCategoryMsg({ type: "danger", text: appError || "Failed to add category" });
    }
  };
  
  const handleCategoryDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      setCategoryMsg({ type: "", text: "" });
      clearError();
      try {
        await deleteCategory(id);
        setCategoryMsg({ type: "success", text: `Category "${name}" deleted.` });
      } catch (err) {
        setCategoryMsg({ type: "danger", text: appError || "Failed to delete category" });
      }
    }
  };


  return (
    <div>
      <h2 className="mb-4">Settings</h2>
      {/* General App Error (like "Email already in use") */}
      {appError && !categoryMsg.text && !profileMsg.text && <Alert variant="danger">{appError}</Alert>}

      <Row className="g-4">
        {/* --- Profile Settings Card --- */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Profile Settings</h5>
              {profileMsg.text && <Alert variant={profileMsg.type}>{profileMsg.text}</Alert>}
              <Form onSubmit={onProfileSubmit}>
                {/* ... Profile form groups (no change) ... */}
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={profileForm.name}
                    onChange={onProfileChange}
                    placeholder="Your name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={onProfileChange}
                    placeholder="your@email.com"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="currency">
                  <Form.Label>Currency</Form.Label>
                  <Form.Select name="currency" value={profileForm.currency} onChange={onProfileChange}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit" variant="primary">Save Changes</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Change Password Card --- */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Change Password</h5>
              {passwordMsg.text && <Alert variant={passwordMsg.type}>{passwordMsg.text}</Alert>}
              <Form onSubmit={onPasswordSubmit}>
                {/* ... Password form groups (no change) ... */}
                <Form.Group className="mb-3" controlId="oldPassword">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    name="oldPassword"
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={onPasswordChange}
                    placeholder="••••••••"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={onPasswordChange}
                    placeholder="New password (min. 6 chars)"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={onPasswordChange}
                    placeholder="Confirm new password"
                  />
                </Form.Group>
                <Button type="submit" variant="primary">Change Password</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* --- ADDED: Manage Categories Card --- */}
      <Row className="mt-4">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Manage Categories</h5>
              {categoryMsg.text && <Alert variant={categoryMsg.type}>{categoryMsg.text}</Alert>}
              
              <Form onSubmit={handleCategorySubmit} className="mb-3">
                <InputGroup>
                  <Form.Control
                    placeholder="New category name (e.g., 'Travel')"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button type="submit" variant="outline-primary">Add</Button>
                </InputGroup>
              </Form>

              <ListGroup variant="flush">
                {categories.length === 0 ? (
                  <ListGroup.Item className="text-muted">No custom categories yet.</ListGroup.Item>
                ) : (
                  categories.map((cat) => (
                    <ListGroup.Item 
                      key={cat._id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {cat.name}
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleCategoryDelete(cat._id, cat.name)}
                      >
                        Delete
                      </Button>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </div>
  );
}