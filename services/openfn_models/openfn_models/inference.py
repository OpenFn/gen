import torch
from peft import PeftModel
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from huggingface_hub import login
import os

HF_ACCESS_TOKEN = os.getenv(
    "HF_ACCESS_TOKEN",
)
login(token=HF_ACCESS_TOKEN)

base_model_id = "meta-llama/Llama-2-7b-hf"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
)

tokenizer = AutoTokenizer.from_pretrained(
    base_model_id,
    padding_side="right",
    add_eos_token=True,
    add_bos_token=True,
    trust_remote_code=True,
)
tokenizer.pad_token = tokenizer.eos_token


base_model = AutoModelForCausalLM.from_pretrained(
    base_model_id,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True,
    use_auth_token=True,
)

ft_model = PeftModel.from_pretrained(base_model, "results/checkpoint-500")

implementation_template = """
Given the following OpenFn instruction:

### Instruction:
{instruction}

Provide the JS implementation code that corresponds to the following OpenFn signature. Ensure that all imports are from '@openfn/':

### Signature:
{signature}

### Implementation:
"""

mailchimp = {
    "instruction": "Create an OpenFn function that tags members from a list.",
    "signature": """/**
 * Tag members with a particular tag
 * @example
 * tagMembers((state) => ({
 *   listId: \"someId\", // All Subscribers list
 *   tagId: \"someTag\", // User tag
 *   members: state.response.body.rows.map((u) => u.email),\n * }));
 * @example
 * tagMembers((state) => ({
 *   listId: \"someId\",
 *   tagId: \"someTag\",
 *   members: state.response.body.rows
 *     .filter((u) => u.allow_other_emails)
 *     .map((u) => u.email),
 * }));
 * @function
 * @param {object} params - a tagId, members, and a list
 * @param {function} [callback] - Optional callback to handle the response
 * @returns {Operation}
 */
 export function tagMembers(params: object, callback?: Function): Operation;
""",
}

cats = {
    "instruction": "",
    "signature": "",
}

prompt = implementation_template.format(
    instruction=mailchimp["instruction"], signature=mailchimp["signature"]
)
print(prompt)

print("Tokenising..")
# eval_prompt = " The following is a note by Eevee the Dog, which doesn't share anything too personal: # "
model_input = tokenizer(prompt, return_tensors="pt").to("cuda")

ft_model.eval()
with torch.no_grad():
    print("Generating..\n")
    print(
        tokenizer.decode(
            ft_model.generate(**model_input, max_new_tokens=300)[0],
            skip_special_tokens=True,
        )
    )

with torch.no_grad():
    print("Generating default..\n")
    print(
        tokenizer.decode(
            base_model.generate(**model_input, max_new_tokens=300)[0],
            skip_special_tokens=True,
        )
    )
