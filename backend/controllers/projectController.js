import Project from "../models/projectModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

function generateStarterCode(language) {
    if (!language) {
        console.error("generateStarterCode received undefined or null language.");
        return "Language not supported.";
    }

    const normalizedLang = language.toLowerCase(); // Normalize safely

    if (normalizedLang === "c++" || normalizedLang === "cpp") {
        return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`;
    } else if (normalizedLang === "java") {
        return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`;
    } else if (normalizedLang === "python") {
        return `print("Hello World")`;
    } else if (normalizedLang === "csharp") {
        return `using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello World");
    }
}`;
    } else if (normalizedLang === "c") {
        return `#include <stdio.h>

int main() {
    printf("Hello World\\n");
    return 0;
}`;
    } else if (normalizedLang === "javascript" || normalizedLang === "js") {
        return `console.log("Hello World");`;
    } else if (normalizedLang === "go") {
        return `package main

import "fmt"

func main() {
    fmt.Println("Hello World")
}`;
    } else {
        return "Language not supported.";
    }
}



export const createProject = async (req, res) => {
    try {
        const { name, projlanguage, token,version } = req.body;

        if (!token) {
            console.error("Token is missing");
            return res.status(400).json({ error: "Token is required" });
        }

        let decoded;
        
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        const project = new Project({
            name,
            projlanguage,
            createdBy: user._id,
            code: generateStarterCode(projlanguage),
            createdAt: Date.now(),
            version
        });


        await project.save();

        return res.status(201).json({
            message: "Project created successfully",
            projectId: project._id,
        });
    } catch (error) {
        console.error("Server Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const saveProject = async (req, res) => {
    try {
        const { projectId, code ,token} = req.body;
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const project = await Project.findOneAndUpdate({ _id: projectId }, { code }, { new: true });
        if (!project) {
            return res.status(400).json({ error: "Project not found" });
        }
        // project.code = code;
        // await project.save();
        return res.status(200).json({ message: "Project saved successfully" }); 
    } catch (error) {
        console.error("Save Project Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export const getProjects = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {    
            return res.status(400).json({ error: "User not found" });
        }
        const projects = await Project.find({ createdBy: user._id }).populate("createdBy","fullname");
        return res.status(200).json({ projects });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getProject = async (req, res) => {
    try {
        const { projectId ,token} = req.body;
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(400).json({ error: "Project not found" });
        }
        return res.status(200).json({ project });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteProject = async (req, res) => {
    try {
        const { projectId ,token} = req.body;
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const project = await Project.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(400).json({ error: "Project not found" });
        }
        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const updateProject = async (req, res) => {
    try {
        const { projectId, name ,token} = req.body;
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(400).json({ error: "Project not found" });
        }
        project.name = name;
        await project.save();
        return res.status(200).json({ message: "Project updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}