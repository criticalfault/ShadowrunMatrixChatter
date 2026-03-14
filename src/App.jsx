import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Typography,
  Box,
  Stack,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { Delete, ContentCopy, Add, DragIndicator, Edit, Check } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function SortableComment({ comment, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(comment.username);
  const [editTextBody, setEditTextBody] = useState(comment.textBody);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: comment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate(comment.id, editUsername, editTextBody);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditUsername(comment.username);
    setEditTextBody(comment.textBody);
    setIsEditing(false);
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: 'background.paper',
        mb: 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 1 }}>
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', mt: 1 }}
        >
          <DragIndicator />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          {isEditing ? (
            <Stack spacing={1}>
              <TextField
                size="small"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                fullWidth
                label="Username"
              />
              <TextField
                size="small"
                value={editTextBody}
                onChange={(e) => setEditTextBody(e.target.value)}
                multiline
                rows={2}
                fullWidth
                label="Comment"
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained" onClick={handleSave}>
                  Save
                </Button>
                <Button size="small" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </Stack>
          ) : (
            <>
              <Typography variant="subtitle2" color="primary">
                {comment.username}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {comment.textBody}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => setIsEditing(!isEditing)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(comment.id)} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </ListItem>
  );
}

function App() {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const [textBody, setTextBody] = useState('');
  const [startTime, setStartTime] = useState('00:00:00');
  const [startDate, setStartDate] = useState('2055-01-01');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const saved = localStorage.getItem('comments');
    if (saved) {
      setComments(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const addComment = () => {
    if (!username.trim() || !textBody.trim()) return;

    const newComment = {
      id: Date.now(),
      username: username.trim(),
      textBody: textBody.trim(),
    };

    setComments([...comments, newComment]);
    setUsername('');
    setTextBody('');
  };

  const deleteComment = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const updateComment = (id, newUsername, newTextBody) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, username: newUsername, textBody: newTextBody } : c
      )
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setComments((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const generateOutput = () => {
    const [hours, minutes, seconds] = startTime.split(':').map(Number);
    const baseDate = new Date(startDate);

    return comments
      .map((comment, idx) => {
        const timestamp = new Date(baseDate);
        timestamp.setHours(hours);
        timestamp.setMinutes(minutes + idx);
        timestamp.setSeconds(seconds + Math.floor(Math.random() * 60));

        const timeStr = timestamp.toTimeString().split(' ')[0];
        const dateStr = timestamp.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        return `>>>>[${comment.textBody}]<<<<\n—— ${comment.username} [${timeStr} (UTC)  ${dateStr}]\n`;
      })
      .join('\n');
  };

  const copyToClipboard = () => {
    const output = generateOutput();
    navigator.clipboard.writeText(output);
    setSnackbar({ open: true, message: 'Copied to clipboard!' });
  };

  const clearAll = () => {
    setComments([]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Comment Formatter
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Time (HH:MM:SS)"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Date (YYYY-MM-DD)"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Comment Text"
              value={textBody}
              onChange={(e) => setTextBody(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addComment}
              fullWidth
            >
              Add Comment
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '600px', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Comments ({comments.length})</Typography>
                <Button size="small" onClick={clearAll} color="error">
                  Clear All
                </Button>
              </Box>
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={comments.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <List>
                      {comments.map((comment) => (
                        <SortableComment
                          key={comment.id}
                          comment={comment}
                          onDelete={deleteComment}
                          onUpdate={updateComment}
                        />
                      ))}
                    </List>
                  </SortableContext>
                </DndContext>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '600px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Output Preview
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                }}
              >
                {generateOutput() || 'No comments yet...'}
              </Box>
              <Button
                variant="contained"
                startIcon={<ContentCopy />}
                onClick={copyToClipboard}
                fullWidth
                sx={{ mt: 2 }}
                disabled={comments.length === 0}
              >
                Copy Output
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity="success">{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
