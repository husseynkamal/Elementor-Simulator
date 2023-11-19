import * as Project from "../models/project";

// Project state mangement
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListeners(listenersFn: Listener<T>) {
    this.listeners.push(listenersFn);
  }
}

export class ProjectState extends State<Project.Project> {
  private projects: Project.Project[] = [];
  private static instance: ProjectState;

  // add private constructor to guarantee that is singleton class
  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project.Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      Project.ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: Project.ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenersFn of this.listeners) {
      listenersFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
