/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [ tasks, setTasks ] = useState<Task[]>([])
  const [newTaskName, setNewTaskName] = useState<string>('');

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    // @todo IMPLEMENT HERE : DELETE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    try {
      await api.delete(`/tasks/${id}`);
      handleFetchTasks();
    } catch (error) {
      console.log(`erreur de suppression :${error}`);
    }
  }

  const handleSave = async (task:Task) => {
    // @todo IMPLEMENT HERE : SAVE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    if (!task.name || task.name.trim() === '') return;
    try {
      const existingTask = tasks.find(t => t.id === task.id);
      if (existingTask && existingTask.name !== task.name) {
        await api.post(`/tasks/${task.id}`, { name: task.name });
        handleFetchTasks();
      }
    } catch (error) {
      console.log(`erreur de sauvegarde :${error}`);
    }
  }

  const handleAddTask = async () => {
    if (newTaskName.trim() === '') return; // Évite d'ajouter une tâche vide

    try {
      const newTask = await api.post('/tasks', { name: newTaskName });
      setTasks([...tasks, newTask]); // Ajoute la nouvelle tâche à l'état
      setNewTaskName(''); // Réinitialise l'input
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField size="small" value={task.name} fullWidth sx={{ maxWidth: 350 }} />
              <Box>
                <IconButton color="success" onClick={() => handleSave(task)} disabled={task.name.trim() === ''}>
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <TextField
            size="small"
            value={newTaskName || ""}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Nouvelle tâche"
            fullWidth
            sx={{ maxWidth: 350 }}
          />
          <Button variant="outlined" onClick={handleAddTask}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
