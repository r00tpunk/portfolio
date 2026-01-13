/* clock */
setInterval(() => {
  document.getElementById("date").textContent =
    new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
}, 1000);

/* neofetch animation */
const neofetchLines = [
  { label: "r00tpunk@kali ~", value: "" },
  { label: "-----------------------------", value: "" },
  { label: "OS      :", value: "Kali Linux" },
  { label: "Shell   :", value: "zsh" },
  { label: "Skills  :", value: "SQLi, Web Pentesting, Linux/Bash, Python, JS/HTML/CSS" },
  { label: "Tools   :", value: "Nmap, Burp Suite, Metasploit, Wireshark, Hydra" },
  { label: "Labs    :", value: "HTB / VulnHub / SQLi Labs" },
  { label: "Status  :", value: "Grinding & Learning" }
];

const container = document.getElementById("neofetchText");
let lineIndex = 0;

function typeLine(line, callback) {
  let charIndex = 0;
  const lineEl = document.createElement("div");

  const labelSpan = document.createElement("span");
  labelSpan.style.color = "var(--accent)";
  labelSpan.textContent = line.label + " ";
  lineEl.appendChild(labelSpan);

  const valueSpan = document.createElement("span");
  valueSpan.style.color = "var(--cyan)";
  lineEl.appendChild(valueSpan);

  container.appendChild(lineEl);

  function typeChar() {
    if (charIndex < line.value.length) {
      valueSpan.textContent += line.value[charIndex++];
      setTimeout(typeChar, 20);
    } else callback();
  }

  line.value.length ? typeChar() : callback();
}

(function typeNext() {
  if (lineIndex < neofetchLines.length)
    typeLine(neofetchLines[lineIndex++], typeNext);
})();

/* skills & tools typing */
function type(el, lines, speed = 30) {
  let i = 0, j = 0;
  el.textContent = "";
  function tick() {
    if (i < lines.length) {
      if (j < lines[i].length) {
        el.textContent += lines[i][j++];
        setTimeout(tick, speed);
      } else {
        el.textContent += "\n";
        i++; j = 0;
        setTimeout(tick, speed);
      }
    }
  }
  tick();
}

type(document.getElementById("skillsBox"), [
"$ SQL Injection",
"$ Web App Pentesting (OWASP Top 10)",
"$ Auth attacks & logic flaws",
"$ Recon & enumeration",
"$ Linux privilege escalation",
"$ Networking (TCP/IP, DNS, HTTP)",
"$ Packet analysis (PCAP)",
"$ CTF problem solving",
"$ Python & Bash automation",
"$ Technical write-ups (Markdown)"
]);

type(document.getElementById("toolsBox"), [
"$ which tools",
"/usr/bin/nmap",
"/usr/bin/burp",
"/usr/bin/sqlmap",
"/usr/bin/ffuf",
"/usr/bin/gobuster",
"/usr/bin/wireshark",
"/usr/bin/metasploit",
"/usr/bin/linpeas",
"/usr/bin/hydra",
"/usr/bin/hashcat",
"/usr/bin/python"
]);
