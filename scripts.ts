// getProjects.ts
const projects = await appKV.get('projects') || [];
return projects;

// createProject.ts
const { name, description, minTarget, maxTarget, website, xHandle, campaignPost, telegramLink } = args;
if (!name || !minTarget || !maxTarget) throw new Error('Name, min target, and max target required');

const projects = await appKV.get('projects') || [];
const newProject = {
  id: crypto.randomUUID(),
  name,
  description,
  minTarget: Number(minTarget),
  maxTarget: Number(maxTarget),
  website,
  xHandle,
  campaignPost,
  telegramLink,
  raised: 0,
  owner: ctx.caller.walletAddress,
  createdAt: Date.now()
};

projects.push(newProject);
await appKV.set('projects', projects);
return newProject;

// getProjectDetails.ts
const { projectId } = args;
const projects = await appKV.get('projects') || [];
const project = projects.find(p => p.id === projectId);
const contributions = await appKV.get(`contributions:\${projectId}`) || [];
return { project, contributions };

// recordContribution.ts
const { projectId, contributor, amount, txHash } = args;
const contributions = await appKV.get(`contributions:\${projectId}`) || [];
contributions.push({
  contributor,
  amount: Number(amount),
  txHash,
  timestamp: Date.now()
});
await appKV.set(`contributions:\${projectId}`, contributions);

const projects = await appKV.get('projects') || [];
const project = projects.find(p => p.id === projectId);
if (project) {
  project.raised = (project.raised || 0) + Number(amount);
  await appKV.set('projects', projects);
}
return { success: true };
