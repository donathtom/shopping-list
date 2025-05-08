// components/AuthForm.tsx

import {
  Alert,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Registrieren
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/");
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    let result;

    if (tab === 0) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    const { error } = result;

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {tab === 0 ? "Anmelden" : "Registrieren"}
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, newTab) => setTab(newTab)}
          centered
          sx={{ mb: 2 }}
        >
          <Tab label="Anmelden" />
          <Tab label="Registrieren" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <TextField
            label="E-Mail"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Passwort"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            {tab === 0 ? "Anmelden" : "Registrieren"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}
