import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { portfolioConfig } from '../../../portfolio.config';
import { CertificateItem, ExperienceItem, PersonalDetailItem, ProjectItem, SkillCategory } from '../../types';

// Strict ATS-Compliant 1-Page Styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 32,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    borderBottomStyle: 'solid',
    paddingBottom: 6,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  title: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  contactBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 8,
    color: '#4B5563',
  },
  contactItem: {
    color: '#111827',
    textDecoration: 'none',
  },
  section: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    borderBottomWidth: 0.75,
    borderBottomColor: '#9CA3AF',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 5,
    color: '#111827',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  entryTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#111827',
  },
  entryCompany: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8.5,
    color: '#374151',
  },
  entryDate: {
    fontSize: 8,
    color: '#4B5563',
  },
  bulletList: {
    marginTop: 2,
    marginBottom: 4,
    paddingLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 1.5,
  },
  bulletDot: {
    width: 3,
    fontSize: 8,
    marginRight: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: '#374151',
    lineHeight: 1.25,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
  },
  skillCategory: {
    width: 105,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: '#111827',
  },
  skillList: {
    flex: 1,
    fontSize: 8.5,
    color: '#374151',
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 8.5,
  },
  certTitle: {
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  certMeta: {
    color: '#4B5563',
    fontSize: 8,
  },
});

export interface ResumeDataPayload {
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  certificates: CertificateItem[];
  personalDetails: PersonalDetailItem[];
}

export const ResumePDFDocument: React.FC<{ data: ResumeDataPayload }> = ({ data }) => {
  const { personal } = portfolioConfig;

  return (
    <Document title={`${personal.name} - Resume`} author={personal.name}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.name}</Text>
          <Text style={styles.title}>{personal.titles.join(' | ')}</Text>
          <View style={styles.contactBar}>
            <Text>{personal.location}</Text>
            <Text>•</Text>
            <Link src={`mailto:${personal.emailProfessional}`} style={styles.contactItem}>
              {personal.emailProfessional}
            </Link>
            {personal.socials.linkedin && (
              <>
                <Text>•</Text>
                <Link src={personal.socials.linkedin} style={styles.contactItem}>
                  LinkedIn
                </Link>
              </>
            )}
            {personal.socials.github && (
              <>
                <Text>•</Text>
                <Link src={personal.socials.github} style={styles.contactItem}>
                  GitHub
                </Link>
              </>
            )}
          </View>
        </View>

        {/* Technical Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {data.skills.map((skillGroup) => (
              <View key={skillGroup.category} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{skillGroup.category}:</Text>
                <Text style={styles.skillList}>{skillGroup.items.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Professional Experience */}
        {data.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 4 }}>
                <View style={styles.entryHeader}>
                  <Text>
                    <Text style={styles.entryTitle}>{exp.title}</Text>
                    <Text style={styles.entryCompany}> — {exp.company}</Text>
                  </Text>
                  <Text style={styles.entryDate}>
                    {exp.startDate} – {exp.endDate}
                  </Text>
                </View>
                {exp.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.map((bullet, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Featured Projects */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Projects</Text>
            {data.projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 3 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{proj.title}</Text>
                  <Text style={styles.entryDate}>{proj.techStack.join(', ')}</Text>
                </View>
                {proj.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {proj.bullets.map((bullet, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Credentials</Text>
            {data.certificates.map((cert) => (
              <View key={cert.id} style={styles.certRow}>
                <Text style={styles.certTitle}>
                  {cert.title} <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>({cert.issuer})</Text>
                </Text>
                <Text style={styles.certMeta}>{cert.issueDate}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Additional Details (Languages & Interests) */}
        {data.personalDetails.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            <View style={styles.skillRow}>
              <Text style={styles.skillCategory}>Languages & Extras:</Text>
              <Text style={styles.skillList}>
                {data.personalDetails
                  .map((d) => `${d.label}${d.proficiency ? ` (${d.proficiency})` : ''}`)
                  .join(' • ')}
              </Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
