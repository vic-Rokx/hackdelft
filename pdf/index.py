from pdfminer.high_level import extract_text
from transformers import pipeline

# Step 1: Extract text from PDF using pdfminer.six
def extract_text_from_pdf(pdf_path):
    try:
        text = extract_text(pdf_path)
        return text
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
        return ""

# Define your PDF path
pdf_path = 'Alfawater-ABF-filters-L.pdf'  # Update with your PDF path
extracted_text = extract_text_from_pdf(pdf_path)
print(extracted_text)  # Print the first 2000 characters for verification

with open("output.txt", "w") as file:
    # Write the string to the file
    file.write(extracted_text)

# # Step 2: Load a pre-trained question-answering pipeline
# qa_pipeline = pipeline("question-answering", model="bert-large-uncased-whole-word-masking-finetuned-squad")

# # Define your questions
# questions = [
#     "What properties of the product exist, like the tempratute?",
#     # "What is the maximum fluid temperature?",
#     # "What industries are the pumps used in?"
# ]

# # Step 3: Ask questions and print answers
# for question in questions:
#     result = qa_pipeline(question=question, context=extracted_text)
#     print(f"Question: {question}")
#     print(f"Answer: {result['answer']}\n")
