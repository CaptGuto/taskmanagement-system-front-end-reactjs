import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const ProjectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    setProjectForDnd: (state, action) => {
      state.value = action.payload;
    },
    removeProject: (state, action) => {
      state.value = state.value.filter(task => task.id !== action.payload);
    },
    toggleProjectFinished: (state, action) => {
      const task = state.value.find(task => task.id === action.payload);
      if (task) {
        task.checked = !task.checked;
      }
    },
    addStep: (state, action) => {
      const { projectId, step } = action.payload;
      const project = state.value.find((project) => project.id === projectId);
      if (project) {
        if (!project.steps) {
          project.steps = [];
        }
        project.steps.push(step);
      }
    },
    removeStep: (state, action) => {
      const { projectId, stepId } = action.payload;
      const project = state.value.find((project) => project.id === projectId);
      
      if (project && project.steps) {
        project.steps = project.steps.filter(step => step.id !== stepId);
      }
    }, 
    toggleStepFinished: (state, action) => {
      const { projectId, stepId } = action.payload;
      const project = state.value.find((project) => project.id === projectId);
      if (project && project.steps) {
        const step = project.steps.find((step) => step.id === stepId);
        if (step) {
          step.checked = !step.checked;
        }
      }
    },
       
  },
});

export const { setProject, setProjectForDnd, removeProject, toggleProjectFinished, addStep, removeStep, toggleStepFinished} = ProjectSlice.actions;
export default ProjectSlice.reducer;
