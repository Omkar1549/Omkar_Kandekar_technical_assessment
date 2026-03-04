from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from utils.dag_checker import check_is_dag  # तुझ्या utils फोल्डरमधील लॉजिक इम्पॉर्ट केलंय

app = FastAPI(
    title="VectorShift Pipeline Parser",
    description="Backend to calculate pipeline properties and detect cycles (DAG).",
    version="1.0.0"
)

# 🌐 CORS Setup: हे खूप महत्त्वाचं आहे जेणेकरून तुझा React Frontend या API शी बोलू शकेल
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # प्रोडक्शनमध्ये इथे तुझ्या फ्रंटएंडची URL टाक (उदा. http://localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """सिस्टिम सुरू आहे की नाही हे तपासण्यासाठी."""
    return {"status": "VectorShift Backend is Running! 🚀"}

@app.post("/pipelines/parse")
async def parse_pipeline(data: Dict[str, Any] = Body(...)):
    """
    Part 4: Pipeline Parsing & DAG Detection
    - हे एंडपॉईंट फ्रंटएंडकडून येणारा 'nodes' आणि 'edges' चा डेटा प्रोसेस करते.
    """
    try:
        # १. फ्रंटएंडकडून आलेला डेटा काढणे
        nodes = data.get("nodes", [])
        edges = data.get("edges", [])

        # २. मोजणी (Calculation)
        num_nodes = len(nodes)
        num_edges = len(edges)

        # ३. DAG चेकिंग (Directed Acyclic Graph)
        # आपण utils/dag_checker.py मध्ये Kahn's Algorithm वापरला आहे
        is_dag = check_is_dag(nodes, edges)

        # ४. रिक्वायर्ड रिस्पॉन्स फॉरमॅट (As per assessment PDF)
        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag
        }

    except Exception as e:
        # काही एरर आला तर प्रॉपर मेसेज देणे
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # सर्वर सुरू करण्यासाठी: uvicorn main:app --reload
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)