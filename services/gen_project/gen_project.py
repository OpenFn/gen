# services/gen_project/gen_project.py
import spacy
import json
import yaml
import os

def parse_workflow_steps(steps):
    workflow = {
        "workflow-1": {
            "name": "Generated Workflow",
            "jobs": {},
            "triggers": {"webhook": {"type": "webhook", "enabled": True}},
            "edges": [],
        }
    }

    previous_job = None

    for step in steps:
        step = step.strip()
        job_name = generate_job_name(step)
        adaptor = extract_adaptor(step)

        workflow["workflow-1"]["jobs"][job_name] = {
            "name": step,
            "adaptor": adaptor,
            "body": "| // Add operations here",
        }

        if previous_job:
            workflow["workflow-1"]["edges"].append({
                f"{previous_job}->{job_name}": {
                    "source_job": previous_job,
                    "target_job": job_name,
                    "condition_type": "on_job_success",
                    "enabled": True
                }
            })
        previous_job = job_name

    if previous_job:
        first_job = list(workflow["workflow-1"]["jobs"].keys())[0]
        workflow["workflow-1"]["edges"].insert(0, {
            f"webhook->{first_job}": {
                "source_trigger": "webhook",
                "target_job": first_job,
                "condition_type": "always",
                "enabled": True
            }
        })

    return workflow


def main(data):
    steps = data.get('steps', [])
    output_format = data.get('format', 'yaml')

    workflow = parse_workflow_steps(steps)

    if output_format == 'json':
        workflow_output = json.dumps(workflow, indent=2)
    else:
        workflow_output = yaml.dump(workflow, sort_keys=False)

    return {"files": {"project.yaml" if output_format == 'yaml' else "project.json": workflow_output}}
